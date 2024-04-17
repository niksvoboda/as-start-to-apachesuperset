const fs      = require('fs').promises;
const fsSync  = require('fs');
const path    = require('path');
const storagePath = '../storage'

class dbFile {
  async readFile(filename) {    
    let _filename = `${filename}.txt`
    _filename =  path.join(__dirname, storagePath , _filename);
    try {
      const data = await fs.readFile(_filename, 'utf8');
      return data;
    } catch (error) {
      console.error(`Error reading file: ${_filename}`, error);
      //throw error; // Генерировать ошибку, если чтение файла не удалось
    }
  }

  async writeFile(filename, data) {    
    let _filename = `${filename}.txt`
    _filename =  path.join(__dirname, storagePath , _filename); 
    try {
      await fs.writeFile(_filename, data);
      console.log(`Сохранен файл: ${_filename}`);
    } catch (error) {
      console.error(`Error writing to file: ${_filename}`, error);
     // throw error; // Генерировать ошибку, если запись в файл не удалась
    }
  }
  async readFileJSON(filename) {    
    let _filename = `${filename}.json`
    _filename =  path.join(__dirname, storagePath , _filename);
    try {
      const data = await fs.readFile(_filename, 'utf8');
      return JSON.parse(data);
    } catch (error) {
     // console.error(`Error reading file: ${_filename}`, error);      
      return null;
      //throw error; // Генерировать ошибку, если чтение файла не удалось
    }
  }

  async writeFileJSON(filename, data, _console = false) {    
    let _filename = `${filename}.json`
    _filename =  path.join(__dirname, storagePath , _filename); 
    try {
      fsSync.writeFileSync(_filename, JSON.stringify(data, null, 2));
      _console && console.log(`Сохранен файл: ${_filename}`);
    } catch (error) {
      console.log(`Error writing to file: ${_filename}`, error);
     // throw error; // Генерировать ошибку, если запись в файл не удалась
    }
  }
}

module.exports = new dbFile();