const Log       = require("../components/log.js");
const axios     = require('axios');
const config    = require("config");
const host      = config.get('api_superset_host')

class api_Superset extends Log {     
    name = "api_Superset";
    async  getCsrfToken(token) {
      const supersetUrl = host
      const headers = {
        'Authorization': `Bearer ${token}`,
      };
    
      // Попытка получить CSRF токен
      try {
        const csrfUrl = `${supersetUrl}/api/v1/security/csrf_token/`; // Убедитесь, что URL верен для вашей версии Superset
        let response = await axios.get(csrfUrl, { headers });
      // console.log(response)
        return response.data.result; // Возвращаем CSRF токен
      } catch (error) {
        console.error('Ошибка при получении CSRF токена: ', error);
      }
    }
     
    async checkOrCreateDataset(token, datasetDetails, csrfToken) {
        const supersetUrl = host
        try {   

          // Проверяем, существует ли датасет
          const datasetsUrl = `${supersetUrl}/api/v1/dataset/`;

          const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            // 'X-CSRFToken': 'ImQyYzc5MzNjODkyNmE3MDc1YzFkNTU0OGE0MTVlZjA5ZWI2OTliN2Yi.Zg6d_Q.enQeVOU6BdkKFMSCaZ4v6PR0gbE',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.3',
            'X-Csrftoken':  `${csrfToken}`, // Включаем CSRF токен в заголовки
            'X-KL-kfa-Ajax-Request': 'Ajax_Request',
            'Referer': `${datasetsUrl}` // Пример указания Referer
          };

          console.log(headers);
      
   


          let response = await axios.get(datasetsUrl, { headers });
          let datasetExists = response.data.result.some(dataset => dataset.table_name === datasetDetails.table_name && dataset.schema === datasetDetails.schema);
          //console.log(response.data.result);
          if (!datasetExists) {
            console.log('Датасет не найден');

            // Если датасет не найден, создаем его
            const createDatasetData = {
              database: datasetDetails.database_id,
              schema: datasetDetails.schema,
              table_name: datasetDetails.table_name,
            };
      
            response = await axios.post(datasetsUrl, createDatasetData, { headers });
        //    console.log('Датасет успешно создан:', response.data);
        //    return response.data.id; // Возвращаем ID созданного датасета
          } else {
            // Если датасет найден, возвращаем его ID
            console.log('Датасет уже существует');
            return response.data.result.find(dataset => dataset.table_name === datasetDetails.table_name && dataset.schema === datasetDetails.schema).id;
          }
        } catch (error) {
            console.log(error);
          console.error('Ошибка при работе с датасетом: ', error.response ? error.response.data : error.message);
        }
      }

    /** Авторизация */
    async getAuthTokens(){
        try {
            const password  = config.get('api_superset_auth.password')
            const login     = config.get('api_superset_auth.login')
            const endpoint  = config.get('api_superset_url.login')
            const url       = host + endpoint
        // Заголовки
            const req_config = {
            headers: {
            'Content-Type': 'application/json; charset=UTF-8'
            }};
        // Тело запроса
            const data =  {
                password: password,
                provider: "db",
                refresh: true,
                username: login
              }
        // Получаем токен
            let access_token = null;
            let refresh_token = null;
            
            await axios.post(url, data, req_config)
            .then(response => {
               // if (response.data.jwt) token = response.data.jwt    
               //console.log(response.data)     
               access_token  = response.data.access_token   
               refresh_token = response.data.refresh_token  
            }).catch(error => {
                console.log("Ошибка авторизации в Superset")
               // console.log(error)
            });

            return {access_token, refresh_token}
        } catch (error) {
            console.log(error)
        }
    }
    async getDatabases() {
        try {
          const host      = config.get('api_superset_host')
          /** логинимся */
          const {access_token, refresh_token} = await api_Superset.getAuthTokens()
              // Заголовки
          const req_config = {
              headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
              }};
          // Тело запроса api/v1/database/
          const endpoint  = `/api/v1/database/`
          const url  = host + endpoint
          const data = {}            
           await axios.get(url, req_config)
              .then(response => {
                 console.log(response.data) 
              }).catch(error => {
                  console.log("Ошибка в Superset")
                  console.log(error)
              });
  
        } catch (error) {
          console.log(error);
        }
      }
}

module.exports =  new api_Superset();