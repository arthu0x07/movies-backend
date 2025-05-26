import { Injectable } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: {
    ips: string[]
    ip: string
  }): Promise<string> {
    return req.ips.length ? req.ips[0] : req.ip // Track by IP
  }
}
