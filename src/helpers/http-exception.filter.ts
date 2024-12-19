import { ExceptionFilter, Catch, ArgumentsHost, HttpException, } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.error(exception);
    
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();
    const message = typeof errorResponse === 'string' ? errorResponse : errorResponse['message'];
    const error = typeof errorResponse === 'string' ? undefined : errorResponse['error'];
    const information = typeof errorResponse === 'string' ? undefined : errorResponse['information'];

    response.status(status).json({
      statusCode: status,
      message: message,
      information: information,
      error: error
    });
  }
}
