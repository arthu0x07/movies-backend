import { ThrottlerModuleOptions } from '@nestjs/throttler'

export const throttlerConfig: ThrottlerModuleOptions = {
  ttl: 60, // tempo em segundos
  limit: 10, // número máximo de requisições no período
} 