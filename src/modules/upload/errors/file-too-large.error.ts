import { BadRequestException } from '@nestjs/common'

export class FileTooLargeError extends BadRequestException {
  constructor(maxSizeMB: number) {
    super(`File too large. Maximum size allowed is ${maxSizeMB}MB`)
  }
}
