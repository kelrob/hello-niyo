import 'dotenv/config';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;
  private validationErrorResponse;

  constructor() {
    this.logger = new Logger();
  }

  catch(exception: Error | HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(exception);

    if (statusCode === HttpStatus.UNPROCESSABLE_ENTITY) {
      exception.message = exception['response'].message;
    }
    const message = Array.isArray(exception.message)
      ? exception.message.map((error) => error.constraints)
      : exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const devErrorResponse: any = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorName: exception?.name,
      message,
    };

    const prodErrorResponse: any = {
      statusCode,
      message,
    };
    this.logger.log({
      requestMethod: request.method,
      requestUrl: request.url,
      error: devErrorResponse,
    });
    response.status(statusCode).json(process.env.NODE_ENV === 'development' ? devErrorResponse : prodErrorResponse);
  }
}
