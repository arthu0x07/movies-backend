import { AppModule } from '@/app.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcrypt'
import request from 'supertest'
import { MovieStatus, Language } from '@prisma/client'
import { slugify } from '@/utils/slugify.util'

describe('MoviesController (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let userId: string
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
    await prisma.movie.deleteMany({})
    await prisma.user.deleteMany({})

    const hashedPassword = await bcrypt.hash('123456', 8)
    const user = await prisma.user.create({
      data: {
        name: 'test user',
        email: `${randomUUID()}@example.com`,
        password: hashedPassword,
      },
    })
    userId = user.id

    accessToken = jwt.sign({ sub: userId })
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /movies', async () => {
    const movieData = {
      title: 'My Movie',
      originalTitle: 'My Original Movie',
      description: 'A description of my movie',
      releaseDate: '2023-01-01T00:00:00.000Z',
      duration: 120,
      status: MovieStatus.RELEASED,
      language: Language.EN,
      userId,
      genresIds: [],
    }

    const response = await request(app.getHttpServer())
      .post('/movies')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(movieData)

    expect(response.statusCode).toBe(201)
    expect(response.body).toMatchObject({
      id: expect.any(String),
      title: movieData.title,
      userId: movieData.userId,
    })

    const movieInDb = await prisma.movie.findUnique({
      where: { id: response.body.id },
    })
    expect(movieInDb).toBeTruthy()
  })

  test('[GET] /movies', async () => {
    await prisma.movie.create({
      data: {
        id: randomUUID(),
        title: 'Test Movie',
        originalTitle: 'Test Movie Original',
        description: 'Description',
        releaseDate: new Date('2023-01-01'),
        duration: 100,
        status: MovieStatus.RELEASED,
        language: Language.EN,
        userId,
        slug: slugify('Test Movie'),
      },
    })

    const response = await request(app.getHttpServer())
      .get('/movies')
      .query({ title: 'Test' })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(0)
  })

  test('[GET] /movies/user/:userId', async () => {
    const movie = await prisma.movie.create({
      data: {
        id: randomUUID(),
        title: 'User Movie',
        originalTitle: 'User Movie Original',
        description: 'Description',
        releaseDate: new Date('2023-01-01'),
        duration: 100,
        status: MovieStatus.RELEASED,
        language: Language.EN,
        userId,
        slug: slugify('User Movie'),
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/movies/user/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.some((m) => m.id === movie.id)).toBe(true)
  })

  test('[GET] /movies/:slug', async () => {
    const slug = slugify('Slug Movie')
    const movie = await prisma.movie.create({
      data: {
        id: randomUUID(),
        title: 'Slug Movie',
        originalTitle: 'Slug Movie Original',
        description: 'Description',
        releaseDate: new Date('2023-01-01'),
        duration: 90,
        status: MovieStatus.RELEASED,
        language: Language.EN,
        userId,
        slug,
      },
    })

    const response = await request(app.getHttpServer())
      .get(`/movies/${slug}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      id: movie.id,
      slug,
      title: movie.title,
    })
  })

  test('[PATCH] /movies/:movieId', async () => {
    const movie = await prisma.movie.create({
      data: {
        id: randomUUID(),
        title: 'Old Title',
        originalTitle: 'Old Original Title',
        description: 'Old description',
        releaseDate: new Date('2023-01-01'),
        duration: 110,
        status: MovieStatus.RELEASED,
        language: Language.EN,
        userId,
        slug: slugify('Old Title'),
      },
    })

    const updatedData = {
      title: 'New Title',
      description: 'New description',
    }

    const response = await request(app.getHttpServer())
      .patch(`/movies/${movie.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updatedData)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      id: movie.id,
      title: updatedData.title,
      description: updatedData.description,
    })

    const movieInDb = await prisma.movie.findUnique({ where: { id: movie.id } })
    expect(movieInDb).not.toBeNull()
    expect(movieInDb!.title).toBe(updatedData.title)
  })

  test('[DELETE] /movies/:movieId', async () => {
    const movie = await prisma.movie.create({
      data: {
        id: randomUUID(),
        title: 'To Delete',
        originalTitle: 'To Delete Original',
        description: 'To Delete description',
        releaseDate: new Date('2023-01-01'),
        duration: 100,
        status: MovieStatus.RELEASED,
        language: Language.EN,
        userId,
        slug: slugify('To Delete'),
      },
    })

    const response = await request(app.getHttpServer())
      .delete(`/movies/${movie.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({ id: movie.id })

    const movieInDb = await prisma.movie.findUnique({ where: { id: movie.id } })
    expect(movieInDb).toBeNull()
  })

  test('[POST] /movies/:movieId/genres', async () => {
    const movie = await prisma.movie.create({
      data: {
        id: randomUUID(),
        title: 'Genre Movie',
        originalTitle: 'Genre Movie Original',
        description: 'Description',
        releaseDate: new Date('2023-01-01'),
        duration: 100,
        status: MovieStatus.RELEASED,
        language: Language.EN,
        userId,
        slug: slugify('Genre Movie'),
      },
    })

    const genre1 = await prisma.genre.create({
      data: { id: randomUUID(), name: 'Action' },
    })
    const genre2 = await prisma.genre.create({
      data: { id: randomUUID(), name: 'Comedy' },
    })

    const response = await request(app.getHttpServer())
      .post(`/movies/${movie.id}/genres`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ genreIds: [genre1.id, genre2.id] })

    expect(response.statusCode).toBe(201)
    expect(response.body.genres).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: genre1.id }),
        expect.objectContaining({ id: genre2.id }),
      ]),
    )
  })

  test('[DELETE] /movies/:movieId/genres/:genreId', async () => {
    const movie = await prisma.movie.create({
      data: {
        id: randomUUID(),
        title: 'Remove Genre Movie',
        originalTitle: 'Remove Genre Movie Original',
        description: 'Description',
        releaseDate: new Date('2023-01-01'),
        duration: 100,
        status: MovieStatus.RELEASED,
        language: Language.EN,
        userId,
        slug: slugify('Remove Genre Movie'),
      },
    })

    const genre = await prisma.genre.create({
      data: { id: randomUUID(), name: 'Drama' },
    })

    await prisma.movie.update({
      where: { id: movie.id },
      data: { genres: { connect: { id: genre.id } } },
    })

    const response = await request(app.getHttpServer())
      .delete(`/movies/${movie.id}/genres/${genre.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty('id', movie.id)
    expect(response.body.genres).toEqual(
      expect.not.arrayContaining([expect.objectContaining({ id: genre.id })]),
    )

    const movieWithGenres = await prisma.movie.findUnique({
      where: { id: movie.id },
      include: { genres: true },
    })
    expect(movieWithGenres!.genres.some((g) => g.id === genre.id)).toBe(false)
  })
})
