const mysql = require("mysql2");
const Log   = require("./log.js");
const config = require("config");
/**
 * Класс для доступа к БД
 */
class Db extends Log {

    name = "Db";
    charset = 'utf8_general_ci';
    enable = false;
    constructor(app){
        super();
        this.app = app;
        /**Создаем пул подключений */
        this.connect(
            config.get('db.host'),
            config.get('db.port'),
            config.get('db.user'),
            config.get('db.password'),
            config.get('db.database')
        );
    }
    
    getConnection(successCallback, failCallback) {        
        this.blue(".getConnection");
        this.pool.getConnection(function(err, connection) {
            if (err) {
                failCallback(err);
            } else {
                this.query("call sp_set_collate()");
                successCallback(connection);
            }
        });
    };

    connect(db_host, db_port, db_user, db_passwd, db_name) {
        const db_config = {
            host: db_host,
            port: db_port,
            user: db_user,
            password: db_passwd,
            database: db_name,
            charset : this.charset,
            multipleStatements: true,
            connectionLimit : 20
        };
        this.blue(".connect to " + db_host + ":" + db_port);
        this.pool = mysql.createPool(db_config);
        this.promisePool = this.pool.promise();        
    }

    query(sql, params = [], callback = null) {
        this.blue(".query sql: " + sql);
        this.getConnection((conn) => {
            conn.query(sql, params, (error, rows, fields) => {
                conn.release();               
                if (callback) {
                    callback(error, rows, fields);
                }
            });
        },
        (error) => {          
            if (callback) {
                callback(error, null, null);                
            }
        });
    }

    async asyncQuery(sql, params = [], isArr) {
        let res;
        try {
            const [rows, fields] = await this.promisePool.query(sql, params);
            // процедуры  возвращают массив, а некоторые простые запросы возвращают объект
            isArr? res = rows :  res = rows[0];
            // если запрос выполнен успешно - добавляем поле errno, указывающее что ошибки не было
            if (res) res.errno = 0;
            //res = rows;
        } catch (e) {
            this.error('QUERY ERROR: ' + e);
            console.log(e)
            res = e;
        }
        return res;
    }
}

module.exports = new Db();