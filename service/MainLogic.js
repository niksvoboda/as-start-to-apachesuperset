const config        = require("config");
const path          = require('path');
const axios     = require('axios');
const Log           = require("../components/log.js");
const dbFile        = require("../components/db_File.js");
const api_Start     = require("../http/api_Start.js");
const api_Superset  = require("../http/api_Superset.js");
const as_Ratings    = require("../models/as_Ratings.js");

/** Флаг указывающий что в данный момент идет синхронизация */
let syncOn = false;
/** Отключение/включение проверки SSL сертификата "Старта" */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = config.get("api_check_ssl") == true? 1 : 0;

class MainLogic extends Log {     
    name = "MainLogic";

    async checkOrCreateDataset() {
      try {

        /** логинимся */
        const {access_token, refresh_token} = await api_Superset.getAuthTokens()
        console.log('access_token:', access_token)
        const datasetDetails = {
          database_id: '3', // ID базы данных в Superset
          schema: null, // Схема базы данных
          table_name: 'tbl_as_ratings', // Имя таблицы
        };

        const csrfToken  = await api_Superset.getCsrfToken(access_token)
        console.log('csrfToken:' , csrfToken)
        const result  = await api_Superset.checkOrCreateDataset(access_token, datasetDetails, csrfToken)

      } catch (error) {
        console.error('Ошибка при работе с датасетом: ', error.response ? error.response.data : error.message);
      }
    }
   
    async importDataFromStart(){
      try {
        /** логинимся */
        const {access_token, refresh_token} = await api_Superset.getAuthTokens()
        console.log(access_token)
        /** Получаем проекты из "Старта" */
        const projects = [
          {as_name: 'CRM система', value: 1, type: 1, datetime: '2024-03-31 06:18:32'},
          {as_name: 'CRM система', value: 2, type: 1, datetime: '2024-04-01 06:18:32'},
          {as_name: 'CRM система', value: 3, type: 1, datetime: '2024-04-02 06:18:32'},
        ]
        for (const point of projects){
          const insert = as_Ratings.insertRating(point.as_name, point.value, point.type, point.datetime);
        }
        /** Создаем запись в бд */
       // const _createChart = await api_Superset.createChart(access_token);
      } catch (error) {
        console.log(error)
      }
    }

    async createChart(){
      try {
        /** логинимся */
        const {access_token, refresh_token} = await api_Superset.getAuthTokens()
        console.log(access_token)
        /** Получаем проекты из "Старта" */
        const projects = [
          {as_name: 'CRM система', value: 1, type: 1, datetime: '2024-03-31 06:18:32'},
          {as_name: 'CRM система', value: 2, type: 1, datetime: '2024-04-01 06:18:32'},
          {as_name: 'CRM система', value: 3, type: 1, datetime: '2024-04-02 06:18:32'},
        ]
        for (const point of projects){
          const insert = as_Ratings.insertRating(point.as_name, point.value, point.type, point.datetime);
        }
        /** Создаем запись в бд */
       // const _createChart = await api_Superset.createChart(access_token);
      } catch (error) {
        console.log(error)
      }
    }

    /** Функция для переодического вызова функции синхронизации всех проектов */
    async autoSync(){
        let polling_time = config.get("api_check_sync_period") * 1000;;
        /** Если синхронизация не выполняется в данный момент то запускаем */
        if (!syncOn) {
            syncOn = true;
          //  const result = await this.updateProjects();
          //  await this.createChart();
          await this.checkOrCreateDataset();
            syncOn = false;
        }
        /** Устанавливаем время следующего вызова */
        setTimeout(()=>{
            this.autoSync();
        }, polling_time );
        this.blue(`sync_interval: ${config.get("api_sync_period")} seconds`);
    }
}

module.exports = new MainLogic();