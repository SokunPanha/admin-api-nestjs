import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp?: string;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data already has the correct structure, return as is
        if (data && typeof data === 'object' && 'message' in data) {
          return data as ApiResponse<T>;
        }

        // Otherwise, wrap the data in the standard response format
        return {
          message: 'Success',
          data: data,
        };
      }),
    );
  }
}
