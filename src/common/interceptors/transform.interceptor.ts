import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
  data: T
  meta?: {
    timestamp: string
    path: string
  }
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest()

    return next.handle().pipe(
      map((response) => {
        // Check if response is already in the correct format
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          'meta' in response
        ) {
          return response
        }

        // Transform response to the correct format
        return {
          data: response,
          meta: {
            timestamp: new Date().toISOString(),
            path: request.url,
          },
        }
      }),
    )
  }
}
