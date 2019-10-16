FROM node:carbon
RUN mkdir app
# Создать директорию app
COPY . /app/bot-service
WORKDIR /app/bot-service
RUN npm install
RUN npm run build-prod
EXPOSE 3000
CMD [ "npm", "run","start:prod"]
