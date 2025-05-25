import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('File upload (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  beforeEach(async () => {
    await prisma.file.deleteMany({})
    await prisma.user.deleteMany({})
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /upload', async () => {
    const response = await request(app.getHttpServer())
      .post('/upload')
      .attach('file', './test/e2e/image.png')

    console.log(response)

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      fileId: expect.any(String),
    })

    console.log('pre fetch database')

    const file = await prisma.file.findUnique({
      where: { id: response.body.fileId },
    })

    expect(file).toBeTruthy()
  })
})
