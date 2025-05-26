import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'
import { WinstonModule } from 'nest-winston'

import { PrismaModule } from '@/database/prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { envSchema } from './env'
import { AuthenticateModule } from './modules/authenticate/authenticate.module'
import { EmailModule } from './modules/email/email.module'
import { HealthModule } from './modules/health/health.module'
import { MoviesModule } from './modules/movies/movies.module'
import { MovieNotificationModule } from './modules/notifications/movie-notifications.module'
import { UploadModule } from './modules/upload/upload.module'
import { UserModule } from './modules/user/user.module'

import { CustomThrottlerGuard } from './common/guards/throttler.guard'
import { LoggingInterceptor } from './common/interceptors/logging.interceptor'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import loggerConfig from './config/logger.config'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 100,
      },
    ]),
    WinstonModule.forRoot(loggerConfig()),
    PrismaModule,
    AuthenticateModule,
    AuthModule,
    EmailModule,
    UploadModule,
    UserModule,
    MoviesModule,
    MovieNotificationModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
