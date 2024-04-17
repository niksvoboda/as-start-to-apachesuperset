# Определяем базовый образ
FROM node:alpine

# Устанавливаем рабочую директорию внутри образа
WORKDIR /app

# Копируем 'package.json' и, если есть, 'package-lock.json'
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта, включая папку storage
COPY . .

# Открываем порт, на котором будет работать приложение
EXPOSE 3000

# Запускаем приложение
CMD ["node", "app.js"]