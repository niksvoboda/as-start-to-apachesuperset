const db            = require("../components/db.js");
const Log           = require("../components/log.js");

class AsRatings extends Log {     
    name = "AsRatings";
    shema = `CREATE TABLE tbl_as_ratings (
        id_as_ratings int NOT NULL,
        as_name varchar(256) NOT NULL,
        value int NOT NULL,
        type int NOT NULL,
        datetime datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        changed_dt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=COMPACT;`
    async getRatings(as_name, type) {
        const query = `SELECT * FROM tbl_as_ratings WHERE as_name = (?) AND type = (?)`
        const result = await db.asyncQuery(query, [as_name, type], true)
        return result
    }
    async insertRating(as_name, value, type, datetime) {
        const query = `INSERT INTO tbl_as_ratings (as_name, value, type, datetime) VALUES (?,?,?,?)`
        const result = await db.asyncQuery(query, [as_name, value, type, datetime], true)
        return result
    }

    /** Функция для получения АС */
    async __getAs(LIMIT, OFFSET) {
        const query = `SELECT 
        uniq_id, 
        Kratkoe_nazvanie_prilozhenie_spisok_sinonimov, 
        Naimenovanie, 
        Naznachenie, 
        Type_confidentiality, 
        standart_contur 
        FROM 
        v_reestr_as_asup LIMIT ? OFFSET ?`
        const result = await db.asyncQuery(query, [LIMIT, OFFSET], true)
        return result
    }
    async getOwners() {
        const query = `SELECT reestr_as_id, boss_id FROM V_REESTR_AS_OWNERS`
        const result = await db.asyncQuery(query, [], true)
        return result
    }
    async getManagers() {
        const query = `SELECT id_reestr_abs, id_PERSONAL_2012 FROM v_reestr_as_manager`
        const result = await db.asyncQuery(query, [], true)
        return result
    }
    async getPersonal2012() {
        const query = `SELECT rowid, fio FROM v_PERSONAL_2012`
        const result = await db.asyncQuery(query, [], true)
        return result
    }
}

module.exports = new AsRatings()