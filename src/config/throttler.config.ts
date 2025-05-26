import { ThrottlerModuleOptions } from '@nestjs/throttler'

export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 60, // tempo em segundos
      limit: 10, // número maximo de requisições
    },
  ],
}
