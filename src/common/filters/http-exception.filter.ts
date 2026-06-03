import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    // 1. Handle Built-in NestJS Exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    }
    // 2. Handle Mongoose/MongoDB Duplicate Key Errors (11000)
    else if (exception.code === 11000) {
      status = HttpStatus.CONFLICT;
      const field = Object.keys(exception.keyPattern || {})[0] || 'field';
      const value = exception.keyValue ? exception.keyValue[field] : '';
      message = `An account with this ${field} (${value}) already exists.`;
    }
    // 3. Handle Mongoose Validation Errors
    else if (exception.name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      const errors = Object.values(exception.errors).map(
        (err: any) => err.message,
      );
      message = `Validation failed: ${errors.join(', ')}`;
    }
    // 4. Handle Mongoose Cast Errors (Invalid ObjectIds)
    else if (exception.name === 'CastError') {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid format for ${exception.path}: ${exception.value}`;
    }
    // 5. Handle Generic Errors
    else if (exception instanceof Error) {
      message = exception.message;
    }

    const responseBody = {
      success: false,
      statusCode: status,
      message: this.formatMessage(message),
      data: null,
      pagination: null,
      summary: null,
      timestamp: new Date().toISOString(),
    };

    // Log Client and Server Errors (400+)
    if (status >= 400) {
      const logMessage = `HTTP Status: ${status} Path: ${request.url} Message: ${
        typeof responseBody.message === 'object'
          ? JSON.stringify(responseBody.message)
          : responseBody.message
      }`;

      if (status >= 500) {
        this.logger.error(
          logMessage,
          exception instanceof Error ? exception.stack : '',
        );
      } else {
        this.logger.warn(logMessage);
      }
    }

    response.status(status).json(responseBody);
  }

  private formatMessage(message: any): string {
    if (typeof message === 'string') {
      return message;
    }

    if (Array.isArray(message)) {
      return message.map((m) => this.formatMessage(m)).join(', ');
    }

    if (typeof message === 'object' && message !== null) {
      // If it's a NestJS error response object
      if (message.message) {
        return this.formatMessage(message.message);
      }

      // Handle class-validator ValidationError objects
      if (message.constraints) {
        return Object.values(message.constraints).join(', ');
      }

      // Handle nested ValidationError children
      if (message.children && message.children.length > 0) {
        return this.formatMessage(message.children);
      }

      return message.error || JSON.stringify(message);
    }

    return String(message);
  }
}
