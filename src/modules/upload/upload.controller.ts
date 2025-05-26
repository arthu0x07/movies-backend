import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { FileUploadDto } from './dto/file-upload.dto'
import { ParseFilePipe } from './pipes/parse-file-pipe'
import { UploadedFile as UploadedFileResponse } from './upload.interface'
import { FileUploadService } from './upload.service'

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('/upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload de arquivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo a ser enviado',
    type: FileUploadDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Arquivo enviado com sucesso',
  })
  async handleUpload(
    @UploadedFile(new ParseFilePipe()) file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required')
    }

    const uploadedFile: UploadedFileResponse =
      await this.fileUploadService.uploadAndCreateFile({
        fileName: file.originalname,
        fileType: file.mimetype,
        body: file.buffer,
      })

    if (!uploadedFile || !uploadedFile.id) {
      throw new BadRequestException(
        'An error occurred while uploading the file',
      )
    }

    return {
      data: { fileId: uploadedFile.id },
      meta: {
        timestamp: new Date().toISOString(),
        path: '/upload',
      },
    }
  }
}
