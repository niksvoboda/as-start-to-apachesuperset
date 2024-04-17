
const config       = require("config");
//const fs            = require("fs");
//const path          = require("path");
const Log          = require("./components/log");
const MainLogic    = require('./service/MainLogic');

class App extends Log {
  name = "App"
  constructor(){
      super();
      this.consoleOff();
      this.showSplash();
      this.startSyncScaner();   
  }
  consoleOff(){
    if(config.get("log.console") == false){
        console.log = () => {}
    }
  }
  startSyncScaner(){
    MainLogic.autoSync()
  }
  showSplash() {
      const splash = [
          "\n", '-'.repeat(80),
          'Запуск системы синхронизации ' + config.get("version"),
          '-'.repeat(80)
      ];
      splash.forEach(line => this.yellow(' '+line));
  }
}

new App();