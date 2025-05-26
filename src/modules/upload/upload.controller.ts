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
import { ParseFilePipe } from './pipes/parse-file-pipe'
import { UploadedFile as UploadedFileResponse } from './upload.interface'
import { FileUploadService } from './upload.service'

@UseGuards(AuthGuard('jwt'))
@Controller('/upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handleUpload(
    @UploadedFile(new ParseFilePipe()) file: Express.Multer.File,
  ): Promise<{ fileId: string }> {
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

    return { fileId: uploadedFile.id }
  }
}
