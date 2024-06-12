import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface CustomErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string;
  details?: any;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = 'Bad Request';
      details = exception.getResponse();
    } else if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Duplicate value error: A unique constraint was violated';
      details = (exception as any).detail || 'Query failed without details';
    } else if (exception instanceof ConflictException) {
      status = HttpStatus.CONFLICT;
    }

    const errorResponse: CustomErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      details,
    };

    response.status(status).json(errorResponse);
  }
}
