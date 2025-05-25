import { BadRequestException } from '@nestjs/common'

export class FileNotFoundError extends BadRequestException {
  constructor() {
    super('File is required')
  }
}
