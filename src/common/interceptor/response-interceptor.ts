import { MESSAGE_MAP } from '@/common/constants/message-map.constant';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { z } from 'zod';

export const ResponseSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.boolean(),
  data: z.any(),
});

export const GetMessageSchema = z.object({
  statusCode: z.number(),
  path: z.string(),
});

export type Response<T> = z.infer<typeof ResponseSchema> & { data: T };
export type GetMessage = z.infer<typeof GetMessageSchema>;

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    const path = request.url;

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        message: this.getSuccessMessage({
          statusCode,
          path,
        }),
        error: false,
        data,
      })),
      catchError((error) => {
        const errorResponse = {
          statusCode: error.status || 500,
          message: error.message || 'Internal server error',
          error: true,
          data: null,
        };
        response.status(errorResponse.statusCode).json(errorResponse);
        return throwError(() => error);
      }),
    );
  }

  private getSuccessMessage({ statusCode, path }: GetMessage): string {
    const basePath =
      Object.keys(MESSAGE_MAP).find((key) => path.includes(key)) || 'default';
    const pathMessages = MESSAGE_MAP[basePath];
    return pathMessages[statusCode] || pathMessages.default;
  }
}
