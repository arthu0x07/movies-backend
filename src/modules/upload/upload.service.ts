import { PrismaService } from '@/database/prisma/prisma.service'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { randomUUID } from 'crypto'
import { InvalidFileTypeError } from './errors/invalid-attachment-type.error'
import { UploadFileRequest, UploadedFile } from './upload.interface'

@Injectable()
export class FileUploadService {
  private client: S3Client

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    const accountId = config.get('CLOUDFLARE_ACC_ID')
    const accessKey = config.get('CLOUDFLARE_ACCESS_KEY_ID')
    const secretAccessKey = config.get('CLOUDFLARE_SECRET_ACCESS_KEY')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey,
      },
    })
  }

  async uploadAndCreateFile({
    fileName,
    fileType,
    body,
  }: UploadFileRequest): Promise<UploadedFile> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      throw new InvalidFileTypeError(fileType)
    }

    const { url } = await this.upload({ fileName, fileType, body })
    return this.createFileRecordInDatabase({ title: fileName, url })
  }

  private async upload({
    fileName,
    fileType,
    body,
  }: UploadFileRequest): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.config.get('CLOUDFLARE_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }

  private async createFileRecordInDatabase({
    title,
    url,
  }: {
    title: string
    url: string
  }): Promise<UploadedFile> {
    const file = await this.prisma.file.create({
      data: {
        title,
        url,
      },
    })

    return {
      id: file.id,
      title: file.title,
      url: file.url,
    }
  }
}
