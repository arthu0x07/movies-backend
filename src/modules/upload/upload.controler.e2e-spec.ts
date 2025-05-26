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
  let accessToken: string

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

    const hashedPassword = await bcrypt.hash('123456', 8)
    const user = await prisma.user.create({
      data: {
        name: 'test user',
        email: `${randomUUID()}@example.com`,
        password: hashedPassword,
      },
    })

    accessToken = jwt.sign({ sub: user.id.toString() })
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /upload — should upload a file successfully', async () => {
    const response = await request(app.getHttpServer())
      .post('/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/image.png')

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('fileId')
    expect(typeof response.body.fileId).toBe('string')

    const file = await prisma.file.findUnique({
      where: { id: response.body.fileId },
    })
    expect(file).toBeTruthy()
  })

  test('[POST] /upload — should reject if no file attached', async () => {
    const response = await request(app.getHttpServer())
      .post('/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toContain('O arquivo é obrigatório')
  })

  test('[POST] /upload — should reject if unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .post('/upload')
      .attach('file', './test/e2e/image.png')

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toContain('Unauthorized')
  })

  test('[POST] /upload — should reject if invalid token', async () => {
    const response = await request(app.getHttpServer())
      .post('/upload')
      .set('Authorization', `Bearer invalidtoken`)
      .attach('file', './test/e2e/image.png')

    expect(response.statusCode).toBe(401)
    expect(response.body.message).toContain('Unauthorized')
  })

  test('[POST] /upload — should reject unsupported file types', async () => {
    const response = await request(app.getHttpServer())
      .post('/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/document.pdf')

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toContain(
      'Tipo de arquivo inválido. Envie uma imagem (jpg, jpeg, png ou webp)',
    )
  })

  test('[POST] /upload — should reject if file too large', async () => {
    const response = await request(app.getHttpServer())
      .post('/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/large-image.jpg')

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toContain(
      'O arquivo excede o tamanho máximo permitido de 5MB',
    )
  })
})
