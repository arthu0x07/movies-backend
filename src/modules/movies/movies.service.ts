import { PrismaService } from '@/database/prisma/prisma.service'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { slugify } from '@/utils/slugify.util'
import { Genre, Prisma } from '@prisma/client'
import { CreateMovieBodyDto } from './dto/create-movie.body.dto'
import { GetMoviesQueryDto } from './dto/get-movies.query.dto'
import { UpdateMovieBodyDto } from './dto/update-movie.body.dto'

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovie(params: CreateMovieBodyDto, userId: string) {
    const { title, genresIds, fileId, ...rest } = params

    await this.validateUserExists(userId)
    await this.validateGenresExist(genresIds)
    await this.validateFileExists(fileId)

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
        fileId,
        genres: genresIds?.length
          ? {
              connect: genresIds.map((id) => ({ id })),
            }
          : undefined,
        ...rest,
        releaseDate: new Date(rest.releaseDate),
      },
      include: {
        genres: true,
        user: true,
        file: true,
      },
    })

    return movie
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
          user: true,
          file: true,
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
          user: true,
          file: true,
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
      },
    }
  }

  async getMovieBySlug(slug: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { slug },
      include: {
        genres: true,
        user: true,
        file: true,
      },
    })

    if (!movie) {
      throw new NotFoundException('Movie not found.')
    }

    return movie
  }

  async updateMovie(
    movieId: string,
    params: UpdateMovieBodyDto,
    userId: string,
  ) {
    await this.validateUserExists(userId)

    const movie = await this.validateMovieExists(movieId)

    if (movie.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this movie.')
    }

    if (params.genresIds) {
      await this.validateGenresExist(params.genresIds)
    }

    if (params.fileId) {
      await this.validateFileExists(params.fileId)
    }

    if (params.duration !== undefined && params.duration < 0) {
      throw new ConflictException('Duration must not be negative.')
    }

    if ('slug' in params) {
      throw new BadRequestException('Updating slug is not allowed.')
    }

    const updateData = { ...params }

    if (params.genresIds) {
      const updateData = { ...params } as Partial<UpdateMovieBodyDto> & {
        genres?: Genre
      }

      delete updateData.genresIds
    }

    if (params.releaseDate) {
      updateData.releaseDate = new Date(params.releaseDate).toISOString()
    }

    const updated = await this.prisma.movie.update({
      where: { id: movieId, userId },
      data: updateData,
    })

    return updated
  }

  async deleteMovie(movieId: string, userId: string) {
    const movie = await this.prisma.movie.findUnique({ where: { id: movieId } })

    if (!movie) {
      throw new NotFoundException('Movie not found.')
    }

    if (movie.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this movie.')
    }

    return this.prisma.movie.delete({ where: { id: movieId } })
  }

  async addGenresToMovie(movieId: string, genreIds: string[], userId: string) {
    await this.validateMovieExists(movieId)
    await this.validateGenresExist(genreIds)

    return this.prisma.movie.update({
      where: { id: movieId, userId },
      data: {
        genres: {
          connect: genreIds.map((id) => ({ id })),
        },
      },
      include: {
        genres: true,
      },
    })
  }

  async removeGenreFromMovie(movieId: string, genreId: string, userId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId, userId },
      include: { genres: true },
    })

    if (!movie) {
      throw new NotFoundException('Movie not found.')
    }

    const isGenreAssociated = movie.genres.some((genre) => genre.id === genreId)

    if (!isGenreAssociated) {
      throw new NotFoundException('Genre is not associated with the movie.')
    }

    return this.prisma.movie.update({
      where: { id: movieId, userId },
      data: {
        genres: {
          disconnect: { id: genreId },
        },
      },
      include: {
        genres: true,
      },
    })
  }

  private async validateUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException('User not found.')
    }
  }

  private async validateGenresExist(genreIds: string[]) {
    if (!genreIds?.length) return

    const foundGenres = await this.prisma.genre.findMany({
      where: { id: { in: genreIds } },
    })

    if (foundGenres.length !== genreIds.length) {
      throw new NotFoundException('One or more genres not found.')
    }
  }

  private async validateFileExists(fileId?: string) {
    if (!fileId) {
      return
    }

    const file = await this.prisma.file.findUnique({ where: { id: fileId } })

    if (!file) {
      throw new NotFoundException('File not found.')
    }
  }

  private async validateMovieExists(movieId: string) {
    const movie = await this.prisma.movie.findUnique({ where: { id: movieId } })

    if (!movie) {
      throw new NotFoundException('Movie not found.')
    }

    return movie
  }
}
