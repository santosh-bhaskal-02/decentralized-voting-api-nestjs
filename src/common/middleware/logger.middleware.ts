import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length') || '0';
      const duration = Date.now() - startTime;

      // Colorize status code
      let colorizedStatus = statusCode.toString();
      if (statusCode >= 500) {
        colorizedStatus = `\x1b[31m${statusCode}\x1b[0m`; // Red
      } else if (statusCode >= 400) {
        colorizedStatus = `\x1b[33m${statusCode}\x1b[0m`; // Yellow
      } else if (statusCode >= 300) {
        colorizedStatus = `\x1b[36m${statusCode}\x1b[0m`; // Cyan
      } else if (statusCode >= 200) {
        colorizedStatus = `\x1b[32m${statusCode}\x1b[0m`; // Green
      }

      this.logger.log(
        `${method} ${originalUrl} ${colorizedStatus} ${contentLength} - ${duration}ms`,
      );
    });

    next();
  }
}
