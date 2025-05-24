import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { PrismaService } from '@/prisma/prisma.service'
import { AppModule } from '@/app.module'

describe('Example Template', () => {
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

  test('should to connect to prisma', async () => {
    const data = await prisma.exampleModel.findMany()
    expect(data).toHaveLength(0)
  })

  test('should to make a request', async () => {
    const response = await request(app.getHttpServer()).get('/hello').send()

    expect(response.text).toBe('Hello, World!!')
  })

  test('should create an ExampleModel entity and verify it exists', async () => {
    const created = await prisma.exampleModel.create({
      data: {
        name: 'Test Entity',
      },
    })

    expect(created).toHaveProperty('id')
    expect(created.name).toBe('Test Entity')

    const found = await prisma.exampleModel.findUnique({
      where: { id: created.id },
    })

    expect(found).not.toBeNull()
    expect(found?.name).toBe('Test Entity')
  })
})
