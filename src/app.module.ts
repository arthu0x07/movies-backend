import { PrismaModule } from '@/database/prisma/prisma.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { envSchema } from './env'
import { AuthenticateModule } from './modules/authenticate/authenticate.module'
import { EmailModule } from './modules/email/email.module'
import { MoviesModule } from './modules/movies/movies.module'
import { MovieNotificationModule } from './modules/notifications/movie-notifications.module'
import { UploadModule } from './modules/upload/upload.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    PrismaModule,
    AuthenticateModule,
    AuthModule,
    EmailModule,
    UploadModule,
    UserModule,
    MoviesModule,
    MovieNotificationModule,
  ],
})
export class AppModule {}
