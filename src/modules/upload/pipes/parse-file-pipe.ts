import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'

export const ValidationMessages = {
  INVALID_EMAIL: 'O e-mail informado não é válido',
  NAME_REQUIRED: 'O nome é obrigatório',
  PASSWORD_REQUIRED: 'A senha é obrigatória',
  FILE_REQUIRED: 'O arquivo é obrigatório',
  INVALID_FILE_TYPE:
    'Tipo de arquivo inválido. Envie uma imagem (jpg, jpeg, png ou webp)',
  FILE_TOO_LARGE: 'O arquivo excede o tamanho máximo permitido de 5MB',
}

@Injectable()
export class ParseFilePipe
  implements PipeTransform<Express.Multer.File, Express.Multer.File>
{
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
  private readonly maxFileSize = 15 * 1024 * 1024 // 15MB (ajustei pra bater com a mensagem)

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
