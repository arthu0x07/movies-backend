import { PrismaModule } from '@/database/prisma/prisma.module'
import { Module } from '@nestjs/common'
import { MoviesController } from './movies.controller'
import { MoviesService } from './movies.service'

@Module({
  imports: [PrismaModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
