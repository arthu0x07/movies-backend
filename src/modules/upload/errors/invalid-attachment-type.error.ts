import { BadRequestException } from '@nestjs/common'

export class InvalidFileTypeError extends BadRequestException {
  constructor(fileType: string) {
    super(`Invalid file type: ${fileType}`)
  }
}
