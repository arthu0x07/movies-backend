import { AppModule } from '@/app.module'
import { PrismaService } from '@/database/prisma/prisma.service'
import { slugify } from '@/utils/slugify.util'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { Language, MovieStatus } from '@prisma/client'
import bcrypt from 'bcrypt'
import { randomUUID } from 'node:crypto'
import request from 'supertest'

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

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  beforeEach(async () => {
    await prisma.movie.deleteMany({})
    await prisma.genre.deleteMany({})
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

  describe('[POST] /movies', () => {
    it('[POST] /movies — should create a movie', async () => {
      const genres = await prisma.genre.create({
        data: {
          name: 'Science Fiction',
        },
      })

      const file = await prisma.file.create({
        data: {
          title: 'Inception',
          url: 'ddade9e7-fa2a-4301-8307-a6afdb5b7ffd-inception.jpg',
        },
      })

      const movieData = {
        title: 'Inception',
        originalTitle: 'Inception',
        description:
          'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
        tagline: 'Your mind is the scene of the crime.',
        releaseDate: '2010-07-16T00:00:00.000Z',
        duration: 148,
        status: MovieStatus.RELEASED,
        language: Language.EN,
        budget: 160000000,
        revenue: 829895144,
        popularity: 85.6,
        votes: 30000,
        ratingPercentage: 91.2,
        genresIds: [genres.id],
        fileId: file.id,
      }

      const response = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(movieData)

      expect(response.statusCode).toBe(201)
      expect(response.body).toMatchObject({
        id: expect.any(String),
        title: movieData.title,
      })
    })

    it('[POST] /movies — should fail without authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/movies')
        .send({})

      expect(response.statusCode).toBe(401)
    })

    it('[POST] /movies — should fail with invalid data', async () => {
      const response = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: '' })

      expect(response.statusCode).toBe(400)
    })

    it('[POST] /movies — should not allow creating two movies with the same slug', async () => {
      const title = 'Duplicated Slug Movie'

      await prisma.movie.create({
        data: {
          id: randomUUID(),
          title,
          originalTitle: title,
          description: 'Description',
          releaseDate: new Date('2023-01-01'),
          duration: 120,
          status: MovieStatus.RELEASED,
          language: Language.EN,
          slug: slugify(title),
          user: { connect: { id: userId } },
        },
      })

      const genres = await prisma.genre.create({
        data: {
          name: 'Science Fiction',
        },
      })

      const file = await prisma.file.create({
        data: {
          title,
          url: 'ddade9e7-fa2a-4301-8307-a6afdb5b7ffd-inception.jpg',
        },
      })

      const movieData = {
        title,
        originalTitle: title,
        description:
          'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
        tagline: 'Your mind is the scene of the crime.',
        releaseDate: '2010-07-16T00:00:00.000Z',
        duration: 148,
        status: MovieStatus.RELEASED,
        language: Language.EN,
        budget: 160000000,
        revenue: 829895144,
        popularity: 85.6,
        votes: 30000,
        ratingPercentage: 91.2,
        genresIds: [genres.id],
        fileId: file.id,
      }

      const response = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(movieData)

      expect(response.statusCode).toBe(409)
    })

    it('[POST] /movies — should return 400 if required fields are missing', async () => {
      const response = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})

      expect(response.statusCode).toBe(400)
    })

    it('[POST] /movies — should return 400 if releaseDate is not a valid date', async () => {
      const genres = await prisma.genre.create({
        data: {
          name: 'Science Fiction',
        },
      })

      const file = await prisma.file.create({
        data: {
          title: 'Inception',
          url: 'ddade9e7-fa2a-4301-8307-a6afdb5b7ffd-inception.jpg',
        },
      })

      const response = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Inception',
          originalTitle: 'Inception',
          description:
            'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
          tagline: 'Your mind is the scene of the crime.',
          releaseDate: 'test-invalid-date',
          duration: 148,
          status: MovieStatus.RELEASED,
          language: Language.EN,
          budget: 160000000,
          revenue: 829895144,
          popularity: 85.6,
          votes: 30000,
          ratingPercentage: 91.2,
          genresIds: [genres.id],
          fileId: file.id,
        })

      expect(response.statusCode).toBe(400)
    })

    it('[POST] /movies — should return 404 if userId does not exist when creating a movie', async () => {
      await prisma.user.delete({
        where: {
          id: userId,
        },
      })

      const genres = await prisma.genre.create({
        data: {
          name: 'Science Fiction',
        },
      })

      const file = await prisma.file.create({
        data: {
          title: 'Inception',
          url: 'ddade9e7-fa2a-4301-8307-a6afdb5b7ffd-inception.jpg',
        },
      })

      const response = await request(app.getHttpServer())
        .post('/movies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Inception',
          originalTitle: 'Inception',
          description:
            'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
          tagline: 'Your mind is the scene of the crime.',
          releaseDate: '2010-07-16T00:00:00.000Z',
          duration: 148,
          status: MovieStatus.RELEASED,
          language: Language.EN,
          budget: 160000000,
          revenue: 829895144,
          popularity: 85.6,
          votes: 30000,
          ratingPercentage: 91.2,
          genresIds: [genres.id],
          fileId: file.id,
        })

      expect(response.statusCode).toBe(404)
    })
  })

  describe('[GET] /movies', () => {
    it('[GET] /movies — should list movies with query', async () => {
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
      expect(Array.isArray(response.body.data)).toBe(true)
    })

    it('[GET] /movies — should filter movies by language, status, and release date', async () => {
      await prisma.movie.createMany({
        data: [
          {
            id: randomUUID(),
            title: 'English Released',
            originalTitle: 'English Released',
            description: 'Description',
            releaseDate: new Date('2023-01-01'),
            duration: 120,
            status: MovieStatus.RELEASED,
            language: Language.EN,
            userId,
            slug: slugify('English Released'),
          },
          {
            id: randomUUID(),
            title: 'Portuguese Upcoming',
            originalTitle: 'Portuguese Upcoming',
            description: 'Description',
            releaseDate: new Date('2025-01-01'),
            duration: 100,
            status: MovieStatus.IN_PRODUCTION,
            language: Language.PT,
            userId,
            slug: slugify('Portuguese Upcoming'),
          },
        ],
      })

      const response = await request(app.getHttpServer())
        .get('/movies')
        .query({
          language: Language.EN,
          status: MovieStatus.RELEASED,
          releaseDateStart: '2023-01-01',
        })
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body.data.length).toBe(1)
      expect(response.body.data[0].title).toBe('English Released')
    })

    it('[GET] /movies — should return 401 if no authentication is provided on list', async () => {
      const response = await request(app.getHttpServer()).get('/movies')

      expect(response.statusCode).toBe(401)
    })

    it('[GET] /movies/:id — should return 404 when trying to fetch a non-existent movie', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(404)
    })

    it('[GET] /movies — should page through all movies without duplicates', async () => {
      const totalMovies = 15
      const perPage = 5
      const allTitles = Array.from(
        { length: totalMovies },
        (_, i) => `Movie ${i + 1}`,
      )

      await Promise.all(
        allTitles.map((title) =>
          prisma.movie.create({
            data: {
              id: randomUUID(),
              title,
              originalTitle: title,
              description: `Description for ${title}`,
              releaseDate: new Date('2023-01-01'),
              duration: 100,
              status: MovieStatus.RELEASED,
              language: Language.EN,
              userId,
              slug: slugify(title),
            },
          }),
        ),
      )

      const seen = new Set<string>()
      const totalPages = Math.ceil(totalMovies / perPage)

      for (let page = 1; page <= totalPages; page++) {
        const response = await request(app.getHttpServer())
          .get('/movies')
          .query({ page, perPage })
          .set('Authorization', `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(200)

        const returned: string[] = response.body.data.map((m) => m.title)
        expect(returned.length).toBe(perPage)

        returned.forEach((t) => {
          expect(allTitles).toContain(t)
          expect(seen.has(t)).toBe(false)
          seen.add(t)
        })
      }

      expect(seen.size).toBe(totalMovies)
      allTitles.forEach((t) => expect(seen.has(t)).toBe(true))
    })

    it('[GET] /movies — should return empty array if page exceeds total', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies')
        .query({ page: 100, perPage: 10 })
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)

      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBe(0)
    })

    it('[GET] /movies — should return default pagination if no params provided', async () => {
      const totalToCreate = 12
      await Promise.all(
        Array.from({ length: totalToCreate }).map((_, i) =>
          prisma.movie.create({
            data: {
              id: randomUUID(),
              title: `Default Movie ${i + 1}`,
              originalTitle: `Original Default Movie ${i + 1}`,
              description: `Description ${i + 1}`,
              releaseDate: new Date('2023-01-01'),
              duration: 100 + i,
              status: MovieStatus.RELEASED,
              language: Language.EN,
              userId,
              slug: slugify(`Default Movie ${i + 1}`),
            },
          }),
        ),
      )

      const response = await request(app.getHttpServer())
        .get('/movies')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)

      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body.data.length).toBe(10)

      expect(response.body.meta.page).toBe(1)
      expect(response.body.meta.perPage).toBe(10)
      expect(response.body.meta.total).toBe(totalToCreate)
      expect(response.body.meta.totalPages).toBe(Math.ceil(totalToCreate / 10))
    })

    it('[GET] /movies — should return 400 for invalid pagination params', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies')
        .query({ page: 'invalid', perPage: -5 })
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(400)
    })
  })

  describe('[GET] /movies/user', () => {
    it('[GET] /movies/user — should get movies by user', async () => {
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
        .get(`/movies/user`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(200)
      expect(response.body.data.some((m) => m.id === movie.id)).toBe(true)
    })

    it('[GET] /movies/user — should page through all user movies without duplicates', async () => {
      const totalMovies = 12
      const perPage = 5
      const allTitles = Array.from(
        { length: totalMovies },
        (_, i) => `User Movie ${i + 1}`,
      )

      await Promise.all(
        allTitles.map((title) =>
          prisma.movie.create({
            data: {
              id: randomUUID(),
              title,
              originalTitle: title,
              description: `Description for ${title}`,
              releaseDate: new Date('2023-01-01'),
              duration: 90,
              status: MovieStatus.RELEASED,
              language: Language.EN,
              userId,
              slug: slugify(title),
            },
          }),
        ),
      )

      const seen = new Set<string>()
      const totalPages = Math.ceil(totalMovies / perPage)

      for (let page = 1; page <= totalPages; page++) {
        const response = await request(app.getHttpServer())
          .get('/movies/user')
          .query({ page, perPage })
          .set('Authorization', `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(200)

        const returned: string[] = response.body.data.map((m) => m.title)
        const expectedLength =
          page === totalPages
            ? totalMovies - perPage * (totalPages - 1)
            : perPage
        expect(returned.length).toBe(expectedLength)

        returned.forEach((t) => {
          expect(allTitles).toContain(t)
          expect(seen.has(t)).toBe(false)
          seen.add(t)
        })
      }

      expect(seen.size).toBe(totalMovies)
      allTitles.forEach((t) => expect(seen.has(t)).toBe(true))
    })
  })

  describe('[GET] /movies/:slug', () => {
    it('[GET] /movies/:slug — should get movie by slug', async () => {
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

    it('[GET] /movies/:slug — should return 404 if movie not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies/non-existent-slug')
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('[PATCH] /movies/:movieId', () => {
    it('[PATCH] /movies/:movieId — should update a movie', async () => {
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

      const response = await request(app.getHttpServer())
        .patch(`/movies/${movie.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'New Title' })

      expect(response.statusCode).toBe(200)
      expect(response.body.title).toBe('New Title')
    })

    it('[PATCH] /movies/:movieId — should return 404 if movie not found', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/movies/non-existent-id`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'New Title' })

      expect(response.statusCode).toBe(404)
    })

    it('[PATCH] /movies/:movieId — should not allow slug update', async () => {
      const movie = await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: 'Immutable Slug',
          originalTitle: 'Immutable Slug',
          description: 'Description',
          releaseDate: new Date('2023-01-01'),
          duration: 100,
          status: MovieStatus.RELEASED,
          language: Language.EN,
          userId,
          slug: slugify('Immutable Slug'),
        },
      })

      const response = await request(app.getHttpServer())
        .patch(`/movies/${movie.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ slug: 'new-slug' })

      expect(response.statusCode).toBe(400)
    })

    it('[PATCH] /movies/:movieId — should return 404 if trying to update a non-existent movie', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/movies/non-existent-id`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ title: 'Updated Title' })

      expect(response.statusCode).toBe(404)
    })

    it('[PATCH] /movies/:movieId — should return 400 if trying to update movie with negative duration', async () => {
      const movie = await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: 'Test Movie',
          originalTitle: 'Test Movie',
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
        .patch(`/movies/${movie.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ duration: -90 })

      expect(response.statusCode).toBe(400)
    })

    it('[PATCH] /movies/:movieId — should return 401 when trying to update a movie without authentication', async () => {
      const movie = await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: 'Auth Test Movie',
          originalTitle: 'Auth Test Movie',
          description: 'Description',
          releaseDate: new Date('2023-01-01'),
          duration: 100,
          status: MovieStatus.RELEASED,
          language: Language.EN,
          userId,
          slug: slugify('Auth Test Movie'),
        },
      })

      const response = await request(app.getHttpServer())
        .patch(`/movies/${movie.id}`)
        .send({ title: 'New Title' })

      expect(response.statusCode).toBe(401)
    })
  })

  describe('[DELETE] /movies/:movieId', () => {
    it('[DELETE] /movies/:movieId — should delete a movie', async () => {
      const movie = await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: 'To Delete',
          originalTitle: 'To Delete Original',
          description: 'Description',
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
      expect(response.body).toHaveProperty('id', movie.id)
    })

    it('[DELETE] /movies/:movieId — should return 404 if movie does not exist', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/movies/non-existent-id`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(404)
    })

    it('[DELETE] /movies/:movieId — should not delete a movie from another user', async () => {
      const otherUser = await prisma.user.create({
        data: {
          id: randomUUID(),
          name: 'Other User',
          email: `${randomUUID()}@example.com`,
          password: await bcrypt.hash('123456', 8),
        },
      })

      const movie = await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: 'Other User Movie',
          originalTitle: 'Other User Movie',
          description: 'Description',
          releaseDate: new Date('2023-01-01'),
          duration: 100,
          status: MovieStatus.RELEASED,
          language: Language.EN,
          userId: otherUser.id,
          slug: slugify('Other User Movie'),
        },
      })

      const response = await request(app.getHttpServer())
        .delete(`/movies/${movie.id}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(403)
    })

    it('[DELETE] /movies/:movieId — should return 404 if trying to delete a non-existent movie', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/movies/non-existent-id`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(404)
    })
  })

  describe('[POST] /movies/:movieId/genres', () => {
    it('[POST] /movies/:movieId/genres — should add genres to movie', async () => {
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

      const genre = await prisma.genre.create({
        data: { id: randomUUID(), name: 'Action' },
      })

      const response = await request(app.getHttpServer())
        .post(`/movies/${movie.id}/genres`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ genreIds: [genre.id] })

      expect(response.statusCode).toBe(201)
      expect(response.body.genres).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: genre.id })]),
      )
    })

    it('[POST] /movies/:movieId/genres — should return 404 if genre does not exist when adding to movie', async () => {
      const movie = await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: 'No Genre Movie',
          originalTitle: 'No Genre Movie',
          description: 'Description',
          releaseDate: new Date('2023-01-01'),
          duration: 100,
          status: MovieStatus.RELEASED,
          language: Language.EN,
          userId,
          slug: slugify('No Genre Movie'),
        },
      })

      const response = await request(app.getHttpServer())
        .post(`/movies/${movie.id}/genres`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ genreIds: ['non-existent-genre-id'] })

      expect(response.statusCode).toBe(400)
    })
  })

  describe('[DELETE] /movies/:movieId/genres/:genreId', () => {
    it('[DELETE] /movies/:movieId/genres/:genreId — should remove a genre from movie', async () => {
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
      expect(response.body.genres).toEqual(
        expect.not.arrayContaining([expect.objectContaining({ id: genre.id })]),
      )
    })

    it('[DELETE] /movies/:movieId/genres/:genreId — should return 404 if genre is not associated with the movie', async () => {
      const movie = await prisma.movie.create({
        data: {
          id: randomUUID(),
          title: 'No Genre Association',
          originalTitle: 'No Genre Association',
          description: 'Description',
          releaseDate: new Date('2023-01-01'),
          duration: 100,
          status: MovieStatus.RELEASED,
          language: Language.EN,
          userId,
          slug: slugify('No Genre Association'),
        },
      })

      const genre = await prisma.genre.create({
        data: { id: randomUUID(), name: 'Fantasy' },
      })

      const response = await request(app.getHttpServer())
        .delete(`/movies/${movie.id}/genres/${genre.id}`)
        .set('Authorization', `Bearer ${accessToken}`)

      expect(response.statusCode).toBe(404)
    })
  })
})
