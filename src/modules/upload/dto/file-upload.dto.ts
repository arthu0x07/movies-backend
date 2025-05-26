import { ApiProperty } from '@nestjs/swagger'
import { Express } from 'express'

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Arquivo de imagem (jpg, png, webp)',
    required: true,
    maxLength: 15 * 1024 * 1024, // 15MB
  })
  file: Express.Multer.File
}
