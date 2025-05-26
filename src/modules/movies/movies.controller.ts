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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Language, MovieStatus } from '@prisma/client'
import { AddGenreBodyDto } from './dto/add-genre-body.dto'
import { CreateMovieBodyDto } from './dto/create-movie.body.dto'
import { GetMoviesByUserDto } from './dto/get-movies-by-user.query.dto'
import { GetMoviesQueryDto } from './dto/get-movies.query.dto'
import { UpdateMovieBodyDto } from './dto/update-movie.body.dto'
import { MoviesService } from './movies.service'

@ApiTags('Movies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('/movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo filme' })
  @ApiBody({ type: CreateMovieBodyDto })
  @ApiResponse({
    status: 201,
    description: 'Filme criado com sucesso',
    schema: {
      example: {
        id: 'uuid-filme-exemplo',
        title: 'Filme Exemplo',
        originalTitle: 'Original Title',
        description: 'Descrição detalhada do filme',
        tagline: 'Tagline do filme',
        releaseDate: '2024-05-25',
        duration: 120,
        status: MovieStatus.RELEASED,
        language: Language.EN,
        budget: 1000000,
        revenue: 5000000,
        popularity: 8.5,
        votes: 1000,
        ratingPercentage: 85,
        genresIds: ['uuid-genero1', 'uuid-genero2'],
        fileId: 'uuid-arquivo-exemplo',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos no corpo da requisição',
  })
  @ApiResponse({ status: 401, description: 'Usuário não autorizado' })
  async createMovie(
    @Body() body: CreateMovieBodyDto,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    return this.moviesService.createMovie(body, userId)
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os filmes com filtros opcionais' })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Filtrar por título',
  })
  @ApiQuery({
    name: 'status',
    enum: MovieStatus,
    required: false,
    description: 'Filtrar por status do filme',
  })
  @ApiQuery({
    name: 'language',
    enum: Language,
    required: false,
    description: 'Filtrar por idioma',
  })
  @ApiQuery({
    name: 'genreIds',
    required: false,
    description: 'Filtrar por IDs de gêneros',
    type: [String],
  })
  @ApiQuery({
    name: 'releaseDateStart',
    required: false,
    description: 'Data mínima de lançamento (ISO 8601)',
    type: String,
  })
  @ApiQuery({
    name: 'releaseDateEnd',
    required: false,
    description: 'Data máxima de lançamento (ISO 8601)',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página para paginação',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    description: 'Quantidade de itens por página',
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de filmes retornada com sucesso',
    schema: {
      example: [
        {
          id: 'uuid1',
          title: 'Filme 1',
          status: MovieStatus.RELEASED,
          language: Language.EN,
          originalTitle: 'Inception',
          description:
            'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.',
          tagline: 'Your mind is the scene of the crime.',
          releaseDate: '2010-07-16T00:00:00.000Z',
          duration: 148,
          budget: 160000000,
          revenue: 829895144,
          popularity: 85.6,
          votes: 30000,
          ratingPercentage: 91.2,
          genresIds: ['uuid-genre1', 'uuid-genre2'],
          fileId: 'uuid-file1',
        },
      ],
    },
  })
  async listAllMovies(@Query() query: GetMoviesQueryDto) {
    return this.moviesService.listAllMovies(query)
  }

  @Get('/user')
  @ApiOperation({ summary: 'Listar filmes do usuário autenticado' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número da página para paginação',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    description: 'Quantidade de itens por página',
    type: Number,
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de filmes do usuário retornada com sucesso',
    schema: {
      example: [
        {
          id: 'uuid-filme-user1',
          title: 'Filme do Usuário',
          // demais campos...
        },
      ],
    },
  })
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
  @ApiOperation({ summary: 'Obter filme por slug' })
  @ApiParam({
    name: 'slug',
    description: 'Slug do filme',
    example: 'filme-exemplo',
  })
  @ApiResponse({
    status: 200,
    description: 'Filme encontrado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  async getMovieBySlug(@Param('slug') slug: string) {
    return this.moviesService.getMovieBySlug(slug)
  }

  @Patch('/:movieId')
  @ApiOperation({ summary: 'Atualizar filme por ID' })
  @ApiParam({
    name: 'movieId',
    description: 'ID do filme',
    example: 'uuid-filme-exemplo',
  })
  @ApiBody({ type: UpdateMovieBodyDto })
  @ApiResponse({
    status: 200,
    description: 'Filme atualizado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  async updateMovie(
    @Param('movieId') movieId: string,
    @Body() body: UpdateMovieBodyDto,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    return this.moviesService.updateMovie(movieId, body, userId)
  }

  @Delete('/:movieId')
  @ApiOperation({ summary: 'Excluir filme por ID' })
  @ApiParam({
    name: 'movieId',
    description: 'ID do filme',
    example: 'uuid-filme-exemplo',
  })
  @ApiResponse({
    status: 200,
    description: 'Filme excluído com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Filme não encontrado' })
  async deleteMovie(
    @Param('movieId') movieId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    return this.moviesService.deleteMovie(movieId, userId)
  }

  @Post('/:movieId/genres')
  @ApiOperation({ summary: 'Adicionar gêneros a um filme' })
  @ApiParam({
    name: 'movieId',
    description: 'ID do filme',
    example: 'uuid-filme-exemplo',
  })
  @ApiBody({ type: AddGenreBodyDto })
  @ApiResponse({
    status: 201,
    description: 'Gêneros adicionados com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Filme ou gênero não encontrado' })
  async addGenresToMovie(
    @Param('movieId') movieId: string,
    @Body() body: AddGenreBodyDto,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    return this.moviesService.addGenresToMovie(movieId, body.genreIds, userId)
  }

  @Delete('/:movieId/genres/:genreId')
  @ApiOperation({ summary: 'Remover gênero de um filme' })
  @ApiParam({
    name: 'movieId',
    description: 'ID do filme',
    example: 'uuid-filme-exemplo',
  })
  @ApiParam({
    name: 'genreId',
    description: 'ID do gênero',
    example: 'uuid-genero-exemplo',
  })
  @ApiResponse({
    status: 200,
    description: 'Gênero removido com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Filme ou gênero não encontrado',
  })
  async removeGenreFromMovie(
    @Param('movieId') movieId: string,
    @Param('genreId') genreId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const userId = user.sub
    return this.moviesService.removeGenreFromMovie(movieId, genreId, userId)
  }
}
