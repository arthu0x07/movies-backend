import { PipeTransform, Injectable } from '@nestjs/common'
import { InvalidFileTypeError } from '../errors/invalid-file-type.error'
import { FileTooLargeError } from '../errors/file-too-large.error'
import { FileNotFoundError } from '../errors/file-not-found.error'

@Injectable()
export class ParseFilePipe
  implements PipeTransform<Express.Multer.File, Express.Multer.File>
{
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png']
  private readonly maxFileSize = 5 * 1024 * 1024 // 5MB
  private readonly maxFileSizeMB = 5

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!file) {
      throw new FileNotFoundError()
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new InvalidFileTypeError(file.mimetype)
    }

    if (file.size > this.maxFileSize) {
      throw new FileTooLargeError(this.maxFileSizeMB)
    }

    return file
  }
}
