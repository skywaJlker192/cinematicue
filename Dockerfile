# Используем легкую версию Node.js
FROM node:20-alpine

# Рабочая директория внутри контейнера
WORKDIR /app

# Копируем весь проект (кроме того, что указано в .dockerignore)
COPY . .

# Переходим в папку backend и устанавливаем зависимости
WORKDIR /app/backend
RUN npm install --production

# Возвращаемся в корень
WORKDIR /app

# Открываем порт, на котором работает сервер
EXPOSE 3001

# Переменные окружения для production
ENV NODE_ENV=production
ENV APP_PORT=3001

# Команда запуска сервера
CMD ["node", "backend/server.js"]
