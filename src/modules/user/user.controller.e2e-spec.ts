import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      data: {
        id: expect.any(String),
        name: 'John Doe',
        email: 'johndoe@example.com',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
      meta: {
        timestamp: expect.any(String),
        path: '/users',
      },
    })
  })
})
