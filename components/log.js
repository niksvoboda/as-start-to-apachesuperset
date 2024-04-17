/**
 * Класс для логирования в консоль из кода
 */
const config = require("config");

class Log {    
    /**
     * Конструктор логера
     * @param string name   Имя класса или модуля от куда производится вывод в консоль
     */
    constructor(name = 'Log') {
          this.name       = name;
          /** подключаем библиотеку окраски текста в консоли */
          this.clc        = require("cli-color");
          /** назначаем типовые цвета  */
         // this.error      = this.clc.red.bold;
        //  this.warn       = this.clc.yellow;
         // this.notice     = this.clc.blue;
         // this.error_bg   = this.clc.xterm(202).bgXterm(1);
         // console.log(msg("Orange text on dark gray background"));
          /** Если в конфиге логирование включено то делаем доступные сообщения в консоль */
          config.get('log.console') == true ? this.enable = true : false;
        }
        
        green(func) {
            if (this.enable) {
                console.log(this.clc.greenBright(this.name + func));           
            }
        }
    
        yellow(func) {
            if (this.enable) {
                console.log(this.clc.yellow(this.name + func));           
        }
        }
        blue(func) {
            if (this.enable) {
                console.log(this.clc.blue(this.name+'.')+func);           
            }
        }
        error(func) {
            if (this.enable) {
                console.log(this.clc.red.bold(this.name + func));           
            }
        }
     
}

module.exports = Log;