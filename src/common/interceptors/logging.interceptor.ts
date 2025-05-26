import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest()
    const { method, url, body, headers, ip } = request
    const userAgent = headers['user-agent'] || ''
    const timestamp = new Date().toISOString()

    // Log the request
    this.logger.log(
      `Incoming Request - Method: ${method} URL: ${url} IP: ${ip} User-Agent: ${userAgent}`,
      {
        timestamp,
        method,
        url,
        body,
        ip,
        userAgent,
      },
    )

    const startTime = Date.now()

    return next.handle().pipe(
      tap({
        next: (data: unknown) => {
          const responseTime = Date.now() - startTime

          // Log the response
          this.logger.log(
            `Outgoing Response - Method: ${method} URL: ${url} Status: 200 Time: ${responseTime}ms`,
            {
              timestamp: new Date().toISOString(),
              method,
              url,
              responseTime,
              responseData: data,
            },
          )
        },
        error: (error: Error) => {
          const responseTime = Date.now() - startTime

          // Log the error
          this.logger.error(
            `Request Failed - Method: ${method} URL: ${url} Error: ${error.message}`,
            {
              timestamp: new Date().toISOString(),
              method,
              url,
              responseTime,
              error: {
                message: error.message,
                stack: error.stack,
              },
            },
          )
        },
      }),
    )
  }
}
