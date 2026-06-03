import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  pagination?: any;
  summary?: any;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const response = http.getResponse();
    const statusCode = response.statusCode;
    const method = request.method;
    const path = request.url;

    return next.handle().pipe(
      map((payload) => {
        let message = this.getContextMessage(method, path);
        let data: T | null = null;
        let pagination: any = undefined;
        let summary: any = undefined;

        if (payload && typeof payload === 'object') {
          if (Array.isArray(payload)) {
            data = this.transformData(payload);
          } else {
            if ('message' in payload) {
              message = payload.message;
            }
            if ('pagination' in payload) {
              pagination = payload.pagination;
            }
            if ('summary' in payload) {
              summary = payload.summary;
            }

            if ('data' in payload) {
              data = this.transformData(payload.data);
            } else {
              const {
                message: _m,
                pagination: _p,
                summary: _s,
                ...rest
              } = payload;

              const transformedRest = this.transformData(rest);
              const remainingKeys = Object.keys(transformedRest);

              if (remainingKeys.length === 1) {
                data = transformedRest[remainingKeys[0]];
              } else if (remainingKeys.length > 1) {
                data = transformedRest as T;
              } else {
                data = null;
              }
            }
          }
        } else {
          data = payload ?? null;
        }

        return {
          success: true,
          statusCode,
          message,
          data,
          pagination,
          summary,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }

  private getContextMessage(method: string, path: string): string {
    const parts = path
      .split('?')[0]
      .split('/')
      .filter((p) => p && p !== 'api' && !/^v\d+$/.test(p));

    const resource = parts[0] ? parts[0].replace(/-/g, ' ') : 'Resource';
    const formattedResource = resource
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    switch (method) {
      case 'POST':
        return `${formattedResource} created successfully`;
      case 'GET':
        return `${formattedResource} fetched successfully`;
      case 'PATCH':
      case 'PUT':
        return `${formattedResource} updated successfully`;
      case 'DELETE':
        return `${formattedResource} deleted successfully`;
      default:
        return 'Success';
    }
  }

  private transformData(data: any): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.transformData(item));
    }

    if (data && typeof data === 'object') {
      if (data instanceof Date) {
        return data.toISOString();
      }

      if (typeof data.toObject === 'function') {
        return data.toObject();
      }
      const transformed: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          transformed[key] = this.transformData(data[key]);
        }
      }
      return transformed;
    }

    return data;
  }
}
