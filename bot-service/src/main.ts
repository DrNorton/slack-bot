import { config } from 'dotenv';
config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import bodyParser = require('body-parser');

import CommonBotConnector from './botkit/common/common.bot.connector';
import validateEnv from './env.init';
import { HttpExceptionFilter } from './filters/http.exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import * as morgan from 'morgan';


console.log(process.env.TYPEORM_HOST);
async function bootstrap() {
  validateEnv();
  const server = express();
  server.use(cors());
  server.use(bodyParser.json());
  server.use(morgan('tiny'));
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use((req, res, next) => {
    console.log(JSON.stringify(req.body)); // this is what you want
    next();
  });
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  const options = new DocumentBuilder()
    .setTitle('Api slack bot')
    .setDescription('Бот для slack')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);
  const connector = await app.resolve<CommonBotConnector>(CommonBotConnector);
  connector.init(server);

  await app.listen(3000);
}
bootstrap();
