import { PrismaService } from '@/database/prisma/prisma.service'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger as WinstonLogger } from 'winston'

import { slugify } from '@/utils/slugify.util'
import { Prisma } from '@prisma/client'
import { CreateMovieBodyDto } from './dto/create-movie.body.dto'
import { GetMoviesQueryDto } from './dto/get-movies.query.dto'
import { UpdateMovieBodyDto } from './dto/update-movie.body.dto'
import { MovieNotificationService } from '../notifications/movie-notification.service'

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly movieNotificationService: MovieNotificationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger: WinstonLogger,
  ) {}

  async createMovie(params: CreateMovieBodyDto, userId: string) {
    const { title, genresIds, posterFileId, bannerFileId, ...rest } = params

    await this.validateUserExists(userId)
    await this.validateGenresExist(genresIds)
    await this.validateFileExists(posterFileId)
    await this.validateFileExists(bannerFileId)

    const slug = slugify(title)
    const existing = await this.prisma.movie.findUnique({ where: { slug } })
    if (existing) {
      throw new ConflictException('Movie with this slug already exists.')
    }

    const movie = await this.prisma.movie.create({
      data: {
        title,
        slug,
        userId,
        posterFileId,
        bannerFileId,
        genres: genresIds?.length
          ? {
              connect: genresIds.map((id) => ({ id })),
            }
          : undefined,
        ...rest,
        releaseDate: new Date(rest.releaseDate + 'T00:00:00.000Z'),
      },
      include: {
        genres: true,
        posterFile: true,
        bannerFile: true,
      },
    })

    // Check if release date is in the future and create notification
    const releaseDate = new Date(rest.releaseDate + 'T00:00:00.000Z') // Force UTC Date Format
    const today = new Date()
    const todayUTC = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    this.winstonLogger.info('Movie created successfully', {
      service: 'MoviesService',
      action: 'createMovie',
      movieId: movie.id,
      movieTitle: movie.title,
      userId,
      releaseDate: releaseDate.toISOString().split('T')[0],
      currentDate: todayUTC.toISOString().split('T')[0],
    })

    if (releaseDate > todayUTC) {
      this.winstonLogger.info('Movie has future release date, creating automatic notification', {
        service: 'MoviesService',
        action: 'createMovie',
        movieId: movie.id,
        movieTitle: movie.title,
        userId,
        releaseDate: releaseDate.toISOString().split('T')[0],
      })
      try {
        await this.movieNotificationService.createNotificationForFutureMovie(
          userId,
          movie.id,
        )
        this.winstonLogger.info('Automatic notification created successfully', {
          service: 'MoviesService',
          action: 'createMovie',
          movieId: movie.id,
          movieTitle: movie.title,
          userId,
        })
      } catch (error) {
        // Log error but don't fail movie creation
        this.winstonLogger.error('Failed to create automatic notification', {
          service: 'MoviesService',
          action: 'createMovie',
          movieId: movie.id,
          movieTitle: movie.title,
          userId,
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        })
      }
    } else {
      this.winstonLogger.debug('Movie does not have future release date, no notification created', {
        service: 'MoviesService',
        action: 'createMovie',
        movieId: movie.id,
        movieTitle: movie.title,
        userId,
        releaseDate: releaseDate.toISOString().split('T')[0],
      })
    }

    return {
      data: movie,
      meta: {
        timestamp: new Date().toISOString(),
        path: '/movies',
      },
    }
  }

  async listAllMovies(query: GetMoviesQueryDto) {
    const {
      title,
      status,
      language,
      genreIds,
      releaseDateStart,
      releaseDateEnd,
      page = 1,
      perPage = 10,
    } = query

    const skip = (Number(page) - 1) * Number(perPage)
    const take = Number(perPage)

    if (isNaN(page) || isNaN(perPage) || page < 1 || perPage < 1) {
      throw new BadRequestException(
        'Invalid pagination parameters: page and perPage must be positive numbers.',
      )
    }

    const where = {
      title: title
        ? { contains: title, mode: Prisma.QueryMode.insensitive }
        : undefined,
      status,
      language,
      releaseDate: {
        gte: releaseDateStart ? new Date(releaseDateStart) : undefined,
        lte: releaseDateEnd ? new Date(releaseDateEnd) : undefined,
      },
      genres: genreIds?.length ? { some: { id: { in: genreIds } } } : undefined,
    }

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        include: {
          genres: true,
          posterFile: true,
          bannerFile: true,
        },
        skip,
        take,
      }),
      this.prisma.movie.count({ where }),
    ])

    return {
      data: movies,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
        path: '/movies',
      },
    }
  }

  async listMoviesByUser(userId: string, page = 1, perPage = 10) {
    await this.validateUserExists(userId)

    const where = { userId }

    const [movies, total] = await Promise.all([
      this.prisma.movie.findMany({
        where,
        include: {
          genres: true,
          posterFile: true,
          bannerFile: true,
        },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.movie.count({ where }),
    ])

    return {
      data: movies,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
        path: '/movies/user',
      },
    }
  }

  async getMovieBySlug(slug: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { slug },
      include: {
        genres: true,
        posterFile: true,
        bannerFile: true,
      },
    })

    if (!movie) {
      throw new NotFoundException('Movie not found.')
    }

    return {
      data: movie,
      meta: {
        timestamp: new Date().toISOString(),
        path: `/movies/${slug}`,
      },
    }
  }

  async updateMovie(
    movieId: string,
    params: UpdateMovieBodyDto,
    userId: string,
  ) {
    await this.validateUserExists(userId)

    const movie = await this.validateMovieExists(movieId)

    if (movie.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this movie.')
    }

    if (params.genresIds) {
      await this.validateGenresExist(params.genresIds)
    }

    if (params.posterFileId) {
      await this.validateFileExists(params.posterFileId)
    }

    if (params.bannerFileId) {
      await this.validateFileExists(params.bannerFileId)
    }

    if (params.duration !== undefined && params.duration < 0) {
      throw new ConflictException('Duration must not be negative.')
    }

    if ('slug' in params) {
      throw new BadRequestException('Updating slug is not allowed.')
    }

    const { genresIds, releaseDate, ...rest } = params

    const updatedMovie = await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        ...rest,
        ...(releaseDate && { releaseDate: new Date(releaseDate + 'T00:00:00.000Z') }), // Force UTC
        genres: genresIds?.length
          ? {
              set: genresIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        genres: true,
        posterFile: true,
        bannerFile: true,
      },
    })

    return {
      data: updatedMovie,
      meta: {
        timestamp: new Date().toISOString(),
        path: `/movies/${movieId}`,
      },
    }
  }

  async deleteMovie(movieId: string, userId: string) {
    const movie = await this.validateMovieExists(movieId)

    if (movie.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this movie.')
    }

    const deletedMovie = await this.prisma.movie.delete({
      where: { id: movieId },
      include: {
        genres: true,
        posterFile: true,
        bannerFile: true,
      },
    })

    return {
      data: deletedMovie,
      meta: {
        timestamp: new Date().toISOString(),
        path: `/movies/${movieId}`,
      },
    }
  }

  async addGenresToMovie(movieId: string, genreIds: string[], userId: string) {
    const movie = await this.validateMovieExists(movieId)

    if (movie.userId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this movie.')
    }

    await this.validateGenresExist(genreIds)

    const updatedMovie = await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        genres: {
          connect: genreIds.map((id) => ({ id })),
        },
      },
      include: {
        genres: true,
        posterFile: true,
        bannerFile: true,
      },
    })

    return {
      data: updatedMovie,
      meta: {
        timestamp: new Date().toISOString(),
        path: `/movies/${movieId}/genres`,
      },
    }
  }

  async removeGenreFromMovie(movieId: string, genreId: string, userId: string) {
    const movie = await this.validateMovieExists(movieId)

    if (movie.userId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this movie.')
    }

    const genreExists = await this.prisma.movie.findFirst({
      where: {
        id: movieId,
        genres: { some: { id: genreId } },
      },
    })

    if (!genreExists) {
      throw new NotFoundException('Genre is not associated with the movie.')
    }

    const updatedMovie = await this.prisma.movie.update({
      where: { id: movieId },
      data: {
        genres: {
          disconnect: { id: genreId },
        },
      },
      include: {
        genres: true,
        posterFile: true,
        bannerFile: true,
      },
    })

    return {
      data: updatedMovie,
      meta: {
        timestamp: new Date().toISOString(),
        path: `/movies/${movieId}/genres/${genreId}`,
      },
    }
  }

  async getAllGenres() {
    const genres = await this.prisma.genre.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return {
      data: genres,
      meta: {
        timestamp: new Date().toISOString(),
        path: '/movies/genres',
      },
    }
  }

  private async validateUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found.')
    }
    return user
  }

  private async validateGenresExist(genreIds: string[]) {
    if (!genreIds?.length) return

    const genres = await this.prisma.genre.findMany({
      where: { id: { in: genreIds } },
    })

    if (genres.length !== genreIds.length) {
      throw new NotFoundException('Genre not found')
    }

    return genres
  }

  private async validateFileExists(fileId?: string) {
    if (!fileId) return

    const file = await this.prisma.file.findUnique({ where: { id: fileId } })
    if (!file) {
      throw new NotFoundException('File not found.')
    }
    return file
  }

  private async validateMovieExists(movieId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
      include: {
        genres: true,
        posterFile: true,
        bannerFile: true,
      },
    })

    if (!movie) {
      throw new NotFoundException('Movie not found.')
    }

    return movie
  }
}
