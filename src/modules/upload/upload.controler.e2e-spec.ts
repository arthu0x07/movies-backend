import { AppModule } from '@/app.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import bcrypt from 'bcrypt'
import { randomUUID } from 'node:crypto'
import request from 'supertest'

describe('File upload (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

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
    const hashedPassword = await bcrypt.hash('123456', 8)

    const user = await prisma.user.create({
      data: {
        name: 'test user',
        email: `${randomUUID()}@example.com`,
        password: hashedPassword,
      },
    })

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .post('/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/image.png')

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      fileId: expect.any(String),
    })

    const file = await prisma.file.findUnique({
      where: { id: response.body.fileId },
    })

    expect(file).toBeTruthy()
  })
})
