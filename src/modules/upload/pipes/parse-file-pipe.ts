import { ValidationMessages } from '@/errors/validation-messages'
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseFilePipe
  implements PipeTransform<Express.Multer.File, Express.Multer.File>
{
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
  private readonly maxFileSize = 15 * 1024 * 1024 // 15MB

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException(ValidationMessages.FILE_REQUIRED)
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(ValidationMessages.INVALID_FILE_TYPE)
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException(ValidationMessages.FILE_TOO_LARGE)
    }

    return file
  }
}
