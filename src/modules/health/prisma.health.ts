import { PrismaService } from '@/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
} from '@nestjs/terminus'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private readonly prismaService: PrismaService) {
    super()
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prismaService.$queryRaw`SELECT 1`
      return this.getStatus(key, true)
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error
          ? e.message
          : e instanceof Prisma.PrismaClientKnownRequestError
            ? e.message
            : 'Database connection failed'

      throw new HealthCheckError(
        'Prisma health check failed',
        this.getStatus(key, false, { message: errorMessage }),
      )
    }
  }
}
