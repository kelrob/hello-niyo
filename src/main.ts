// Import necessary modules and dependencies
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  ImATeapotException,
  INestApplication,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/httpExceptionFilter';

// Function to start the server on the specified port
const startServer = async (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  await app.listen(port, '0.0.0.0');
};

// Function to configure global pipes and filters for the application
const setupNestApp = (app: INestApplication) => {
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
};

// Function to enable CORS (Cross-Origin Resource Sharing)
const setupCors = (app: INestApplication) => {
  const whitelist = [
    'http://localhost:3000',
    'http://localhost:4000',
    'https://robert-hello-niyo-production.up.railway.app',
    'https://hello-niyo.tiiny.site',
  ];
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: function (origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (
        whitelist.includes(origin) ||
        (origin && typeof origin === 'string' && origin.match(/^https:\/\/hello-niyo\.tinny\.site$/))
      ) {
        console.log('allowed cors for:', origin);
        callback(null, true);
      } else {
        console.log('blocked cors for:', origin);
        callback(new ImATeapotException('Not allowed by CORS'), false);
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  });
};

// Function to create a validation pipe with common configuration options (DTO)
const createValidationPipe = () => {
  return new ValidationPipe({
    transform: true,
    whitelist: true,
    exceptionFactory: (errors) => {
      return new UnprocessableEntityException(errors);
    },
  });
};

// Bootstrap the application
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  const configService = app.get(ConfigService);
  const port = configService.get('port');

  // Setup global pipes, filters, and CORS
  setupNestApp(app);
  setupCors(app);

  // Start the server
  await startServer(app);

  // Log the server start-up message
  Logger.log(`Server started running on http://localhost:${port}`);
}

// Start the application
bootstrap();
