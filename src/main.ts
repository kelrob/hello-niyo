// Import necessary modules and dependencies
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exceptions/httpExceptionFilter';

// Function to start the server on the specified port
const startServer = async (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  await app.listen(port);
};

// Function to configure global pipes and filters for the application
const setupNestApp = (app: INestApplication) => {
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
};

// Function to enable CORS (Cross-Origin Resource Sharing)
const setupCors = (app: INestApplication) => {
  app.enableCors({ origin: true });
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
