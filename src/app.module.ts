import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { PrismaModule } from '@/database/prisma/prisma.module'
import { UploadModule } from './modules/upload/upload.module'
import { UserModule } from './modules/user/user.module'
import { AuthenticateModule } from './modules/authenticate/authenticate.module'
import { AuthModule } from './auth/auth.module'
import { EmailModule } from './modules/email/email.module'

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
  ],
})
export class AppModule {}
