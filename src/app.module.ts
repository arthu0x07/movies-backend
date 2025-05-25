import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { PrismaModule } from '@/prisma/prisma.module'
import { HelloModule } from './modules/hello/hello.module'
import { UploadModule } from './modules/upload/upload.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    PrismaModule,
    HelloModule,
    UploadModule,
  ],
})
export class AppModule {}
