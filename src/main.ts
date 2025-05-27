import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { PrismaService } from './database/prisma/prisma.service'
import { Env } from './env'

import { seedMovies } from 'prisma/seed/movies.seed'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: '*',
    credentials: true,
  })

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('PORT', { infer: true })

  const prismaService = app.get(PrismaService)
  await seedMovies(prismaService)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Movies API')
    .setDescription(
      `
API RESTful para gerenciamento de filmes com recursos avançados de segurança e monitoramento.

### Recursos Principais
- Sistema completo de autenticação e autorização via JWT
- Upload e validação de imagens com limites de tamanho
- Gerenciamento de filmes e gêneros com busca avançada
- Sistema de notificações para lançamentos
- Logs detalhados de todas as operações
- Rate limiting e proteção contra abusos
- Health check para monitoramento da aplicação

### Respostas Padronizadas
Todas as respostas seguem o formato:
\`\`\`json
{
  "data": {
    // Dados da resposta
  },
  "meta": {
    "timestamp": "2024-03-21T10:00:00Z",
    "path": "/endpoint"
  }
}
\`\`\`

### Autenticação
Use o endpoint \`/authenticate\` para obter um token JWT.
Inclua o token no header \`Authorization: Bearer {token}\` para acessar endpoints protegidos.

### Rate Limiting
- 100 requisições por minuto por IP
- Respostas incluem headers X-RateLimit-* com informações de limite

### Uploads
- Suporte para imagens (jpg, png, webp)
- Limite de 15MB por arquivo
- Validação de tipo e dimensões
    `,
    )
    .setVersion('1.0')
    .setContact(
      'Suporte',
      'https://github.com/arthu0x07/movies-backend',
      'suporte@example.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:' + port, 'Local Development')
    .addServer('https://api.movies.example.com', 'Production')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
      'access-token',
    )
    .addTag(
      'Autenticação',
      'Endpoints para autenticação e gerenciamento de tokens',
    )
    .addTag('Usuários', 'Gerenciamento de contas de usuário')
    .addTag('Movies', 'Operações com filmes e gêneros')
    .addTag('Upload', 'Upload e gerenciamento de arquivos')
    .addTag('Health', 'Monitoramento da saúde da aplicação')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'Movies API Documentation',
    customfavIcon: 'https://nestjs.com/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  })

  await app.listen(port)
}
bootstrap()
