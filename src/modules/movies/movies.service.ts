import { PrismaService } from '@/database/prisma/prisma.service'
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { slugify } from '@/utils/slugify.util'
import { CreateMovieBodyDto } from './dto/create-movie.body.dto'
import { GetMoviesQueryDto } from './dto/get-movies-query.dto'
import { UpdateMovieBodyDto } from './dto/update-movie.body.dto'

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovie(body: CreateMovieBodyDto) {
    const { title, userId, genresIds, ...rest } = body

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
        ...rest,
        genres: {
          connect: genresIds?.map((id) => ({ id })) || [],
        },
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
      userId,
      releaseDateStart,
      releaseDateEnd,
    } = query

    return this.prisma.movie.findMany({
      where: {
        title: title ? { contains: title, mode: 'insensitive' } : undefined,
        status,
        language,
        userId,
        releaseDate: {
          gte: releaseDateStart ? new Date(releaseDateStart) : undefined,
          lte: releaseDateEnd ? new Date(releaseDateEnd) : undefined,
        },
        genres: genreIds?.length
          ? {
              some: {
                id: { in: genreIds },
              },
            }
          : undefined,
      },
      include: {
        genres: true,
        user: true,
        file: true,
      },
    })
  }

  async listMoviesByUser(userId: string) {
    return this.prisma.movie.findMany({
      where: { userId },
      include: {
        genres: true,
        user: true,
        file: true,
      },
    })
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

  async updateMovie(movieId: string, body: UpdateMovieBodyDto) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    })

    if (!movie) {
      throw new NotFoundException('Movie not found.')
    }

    const updated = await this.prisma.movie.update({
      where: { id: movieId },
      data: body,
    })

    return updated
  }

  async deleteMovie(movieId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    })

    if (!movie) {
      throw new NotFoundException('Movie not found.')
    }

    return this.prisma.movie.delete({ where: { id: movieId } })
  }

  async addGenresToMovie(movieId: string, genreIds: string[]) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    })

    if (!movie) {
      throw new NotFoundException('Movie not found.')
    }

    return this.prisma.movie.update({
      where: { id: movieId },
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

  async removeGenreFromMovie(movieId: string, genreId: string) {
    const movie = await this.prisma.movie.findUnique({
      where: { id: movieId },
    })

    if (!movie) {
      throw new NotFoundException('Movie not found.')
    }

    return this.prisma.movie.update({
      where: { id: movieId },
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
}
