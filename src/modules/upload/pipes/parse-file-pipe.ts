import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { ValidationMessages } from '@/errors/validation-messages'

const MAX_SIZE_IN_BYTES = 15 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

@Injectable()
export class ParseImageFilePipe
  implements PipeTransform<Express.Multer.File, Express.Multer.File>
{
  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new BadRequestException(ValidationMessages.FILE_REQUIRED)
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(ValidationMessages.INVALID_FILE_TYPE)
    }

    if (file.size > MAX_SIZE_IN_BYTES) {
      throw new BadRequestException(ValidationMessages.FILE_TOO_LARGE)
    }

    return file
  }
}
