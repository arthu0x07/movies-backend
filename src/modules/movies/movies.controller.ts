import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt-strategy'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AddGenreBodyDto } from './dto/add-genre-body.dto'
import { CreateMovieBodyDto } from './dto/create-movie.body.dto'
import { GetMoviesByUserDto } from './dto/get-movies-by-user.query.dto'
import { GetMoviesQueryDto } from './dto/get-movies.query.dto'
import { UpdateMovieBodyDto } from './dto/update-movie.body.dto'
import { MoviesService } from './movies.service'

@UseGuards(AuthGuard('jwt'))
@Controller('/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async createMovie(
    @Body() body: CreateMovieBodyDto,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    return this.moviesService.createMovie(body, userId)
  }

  @Get()
  async listAllMovies(@Query() query: GetMoviesQueryDto) {
    return this.moviesService.listAllMovies(query)
  }

  @Get('/user')
  async getMoviesByUser(
    @Query() query: GetMoviesByUserDto,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    const page = Number(query.page) || 1
    const perPage = Number(query.perPage) || 10

    return this.moviesService.listMoviesByUser(userId, page, perPage)
  }

  @Get('/:slug')
  async getMovieBySlug(@Param('slug') slug: string) {
    return this.moviesService.getMovieBySlug(slug)
  }

  @Patch('/:movieId')
  async updateMovie(
    @Param('movieId') movieId: string,
    @Body() body: UpdateMovieBodyDto,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    return this.moviesService.updateMovie(movieId, body, userId)
  }

  @Delete('/:movieId')
  async deleteMovie(
    @Param('movieId') movieId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    return this.moviesService.deleteMovie(movieId, userId)
  }

  @Post('/:movieId/genres')
  async addGenresToMovie(
    @Param('movieId') movieId: string,
    @Body() body: AddGenreBodyDto,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    return this.moviesService.addGenresToMovie(movieId, body.genreIds, userId)
  }

  @Delete('/:movieId/genres/:genreId')
  async removeGenreFromMovie(
    @Param('movieId') movieId: string,
    @Param('genreId') genreId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub

    return this.moviesService.removeGenreFromMovie(movieId, genreId, userId)
  }
}
