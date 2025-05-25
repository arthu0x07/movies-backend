import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

@Injectable()
export class ParseFilePipe
  implements PipeTransform<Express.Multer.File, Express.Multer.File>
{
  transform(value: Express.Multer.File): Express.Multer.File {
    if (!value) {
      throw new BadRequestException('File is required')
    }
    return value
  }
}
