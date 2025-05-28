# Projeto Back End - Cubos Movies

Sistema completo de gerenciamento de filmes com notificações automáticas <br /><br />

### Tecnologias Configuradas:

- Framework: Nest.js
- ORM: Prisma
- Linguagem: TypeScript
- Banco de Dados: PostgreSQL
- Containerização: Docker
- Testes Automatizados: Vitest
- Zod para validação de variáveis ambientes
- ConfigModule do Nest para consumo de variáveis ambientes
- Swagger para documentação de API
- Envio de E-mails (Resend)
- Upload de imagens (Cloudflare R2)
- Sistema de Logs e Monitoramento (Winston)
- Rate Limiting e Proteção contra abusos
- Health Check para monitoramento da aplicação
- Sistema de Notificações com Cron Jobs
- Autenticação JWT com chaves RSA
- Validação de dados com Class Validator

<br /><br />

## Descrição

API RESTful para gerenciamento de filmes com recursos avançados de segurança, notificações e monitoramento:

- Sistema completo de autenticação e autorização JWT
- Upload e validação de imagens para posters e banners
- Gerenciamento completo de filmes, gêneros e usuários
- Sistema de notificações automáticas por email
- Logs detalhados de todas as operações com Winston
- Proteção contra ataques de força bruta e rate limiting
- Monitoramento de saúde da aplicação e banco de dados
- Respostas padronizadas em formato JSON com metadados
- Cron jobs para envio automático de notificações
- Suporte a múltiplos idiomas e status de filmes
- Sistema de relacionamentos entre usuários, filmes e notificações

<br /><br />

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente nos seus .env's

### Banco de Dados
`DATABASE_URL` - _URL utilizada para se conectar com o banco de dados PostgreSQL_

### Servidor
`PORT` - _Porta específica para rodar a aplicação (padrão: 3333)_

### Autenticação JWT
`JWT_PRIVATE_KEY` - _Chave privada RSA para assinatura de tokens JWT_
`JWT_PUBLIC_KEY` - _Chave pública RSA para verificação de tokens JWT_

### Upload de Arquivos (Cloudflare R2)
`CLOUDFLARE_ACC_ID` - _ID da conta Cloudflare_
`CLOUDFLARE_BUCKET_NAME` - _Nome do bucket R2 para armazenamento_
`CLOUDFLARE_ACCESS_KEY_ID` - _Access Key ID do Cloudflare R2_
`CLOUDFLARE_SECRET_ACCESS_KEY` - _Secret Access Key do Cloudflare R2_

### Envio de E-mails
`RESEND_API_KEY` - _Chave da API Resend para envio de emails_

### Rate Limiting (Opcionais)
`THROTTLE_TTL` - _Tempo em segundos para o rate limiting (padrão: 60)_
`THROTTLE_LIMIT` - _Número máximo de requisições por TTL (padrão: 100)_

<br /><br />

## Observação das variáveis de Ambiente p/ o Docker

Para rodar a aplicação com Docker, crie um arquivo .env.docker semelhante ao encontrado na raiz do projeto padrão e altere a URL do banco de dados para apontar para o IP do container, "postgres:5432", em vez de "localhost:5432". Isso permitirá que a aplicação se comunique com o banco de dados dentro do container e permitirá que nós, na máquina Host, consigamos nos comunicar diretamente com a aplicação para executar requisições.

<br /><br />

## Observação das variáveis de Ambiente padrões

Ao rodar a aplicação com o docker utilizando o IP do container, causa um conflito com a utilização do prisma para executar e criar migrações, como o prisma utiliza a mesma variável ambiente chamada "DATABASE_URL", ele não consegue se comunicar diretamente com o IP postgres:5432.

Para contornar isso, devemos fazer o prisma utilizar o IP da nossa maquina HOST, já que o container do postgres está expondo sua porta para a máquina HOST, e para termos esse comportamento, devemos ter um novo arquivo chamado .env, que será utilizado pela nossa máquina HOST para poder executar migrações e fazer o prisma se conectar corretamente com o banco de dados rodando dentro do container.

Em resumo, precisaremos de dois arquivos .env's, um para ambiente de desenvolvimento sem conflitos e outro para executar a aplicação no docker-compose.

<br /><br />

## Observação das variáveis de Ambiente de Desenvolvimento

Ao rodar a aplicação com Docker, utilizando o IP do container, ocorre um conflito com o Prisma ao executar e criar migrações. Isso acontece porque o Prisma utiliza a mesma variável de ambiente "DATABASE_URL" e não consegue se comunicar diretamente com o IP postgres:5432, que é necessário para que a aplicação consiga se comunicar com o banco entre os containers.

Para solucionar esse problema, configuramos o Prisma para usar o IP da máquina host, uma vez que o container do PostgreSQL está expondo sua porta para a máquina host. Para isso, criamos um novo arquivo chamado .env, que será utilizado pela máquina host para executar migrações e permitir que o Prisma se conecte corretamente ao banco de dados rodando dentro do container.

Desta forma, conseguimos executar a aplicação com docker-compose e ainda podemos utilizar do prisma sem problemas para criar e executar migrações :D

<br /><br />

## Instalação

#### Versões recomendadas:

- Node: 20.12.1
- Docker: 26.1.1
- Docker-Compose: 2.24.6

<br /><br />

#### Passo a Passo: _(Com docker)_

```bash
  git clone https://github.com/arthu0x07/movies-backend.git

  npm install

  docker-compose build --no-cache
  docker-compose up

  * Após executar 'docker-compose up' se atente aos logs para conferir se a aplicação executou corretamente *
```

<br />

#### Passo a Passo: _(Desenvolvimento)_

```bash
  git clone https://github.com/arthu0x07/movies-backend.git

  npm install

  docker-compose up postgres

  npm run start:dev
```

<br /><br />

## Rodando os testes

Para rodar os testes, faça o processo de instalação do projeto, e rode os seguintes comando:

```bash
  docker-compose up postgres

  npm run test:e2e
```

<br /><br />

## Estrutura da API

### Módulos Principais

#### 🎬 **Movies**
- Gerenciamento completo de filmes (CRUD)
- Upload de posters e banners
- Relacionamento com gêneros e usuários
- Filtros avançados (data, duração, status, idioma, gêneros)
- Paginação e busca por título
- Geração automática de slugs

#### 👤 **Authentication**
- Sistema de autenticação JWT com chaves RSA
- Registro e login de usuários
- Proteção de rotas com guards
- Criptografia de senhas com bcrypt

#### 👥 **Users**
- Gerenciamento de usuários
- Relacionamento com filmes criados
- Sistema de notificações por usuário

#### 📧 **Notifications**
- Sistema automático de notificações por email
- Cron jobs para verificação diária de lançamentos
- Inscrição automática em filmes com data futura
- Gerenciamento de status de notificações enviadas

#### 📁 **Upload**
- Upload de imagens para Cloudflare R2
- Validação de tipos de arquivo (JPEG, PNG, WebP)
- Geração de URLs públicas para acesso

#### 📧 **Email**
- Integração com Resend para envio de emails
- Templates para notificações de lançamento
- Sistema de retry em caso de falhas

#### 🏥 **Health**
- Monitoramento de saúde da aplicação
- Verificação de conectividade com banco de dados
- Endpoints para health checks

<br /><br />

## Endpoints da API

### Autenticação
```
POST   /auth/register     - Registro de usuário
POST   /auth/login        - Login de usuário
```

### Filmes
```
GET    /movies            - Listar filmes (com filtros e paginação)
POST   /movies            - Criar filme
GET    /movies/genres     - Listar gêneros disponíveis
GET    /movies/:slug      - Buscar filme por slug
PATCH  /movies/:id        - Atualizar filme
DELETE /movies/:id        - Deletar filme
POST   /movies/:id/genres - Adicionar gêneros ao filme
DELETE /movies/:id/genres/:genreId - Remover gênero do filme
```

### Usuários
```
GET    /users/me          - Dados do usuário logado
GET    /users/:id/movies  - Filmes do usuário
```

### Notificações
```
POST   /notifications/movies/:movieId        - Inscrever em notificação
DELETE /notifications/movies/:movieId        - Cancelar inscrição
GET    /notifications/movies/:movieId/status - Status da inscrição
```

### Upload
```
POST   /upload            - Upload de arquivo
```

### Health Check
```
GET    /health            - Status da aplicação
```

### Documentação
```
GET    /api               - Swagger UI
```

**Após rodar o projeto, acesse a documentação completa da API em:** `http://localhost:3000/docs`

<br /><br />

## Modelo de Dados

### Entidades Principais

#### **User**
- id, name, email, password
- timestamps (createdAt, updatedAt)
- Relacionamentos: movies[], notifications[]

#### **Movie**
- Informações básicas: title, slug, originalTitle, description, tagline
- Dados técnicos: releaseDate, duration, status, language
- Métricas: budget, revenue, popularity, votes, ratingPercentage
- Arquivos: posterFileId, bannerFileId
- Relacionamentos: user, genres[], notifications[]

#### **Genre**
- id, name
- Relacionamentos: movies[]

#### **File**
- id, title, url
- Relacionamentos: moviePosters[], movieBanners[]

#### **UserMovieNotification**
- id, userId, movieId, notified
- timestamps (createdAt)
- Relacionamentos: user, movie

### Enums
- **MovieStatus**: RELEASED, IN_PRODUCTION, PLANNED, CANCELLED
- **Language**: EN, PT, ES, FR, DE, JP

<br /><br />

## Sistema de Notificações

### Funcionamento
1. **Criação Automática**: Ao criar/editar filme com data futura, usuário é automaticamente inscrito
2. **Verificação Diária**: Cron job roda a cada minuto verificando filmes lançados hoje
3. **Envio de Email**: Notificações são enviadas para usuários inscritos
4. **Controle de Status**: Sistema evita envios duplicados

### Logs Estruturados
- Logs profissionais com Winston
- Informações contextuais (IDs, timestamps, ações)
- Diferentes níveis: info, debug, error
- Arquivos separados: combined.log, error.log, exceptions.log

<br /><br />

## Scripts Disponíveis

```bash
npm run start          # Iniciar aplicação
npm run start:dev      # Modo desenvolvimento (watch)
npm run start:debug    # Modo debug
npm run start:prod     # Modo produção
npm run build          # Build da aplicação
npm run test           # Testes unitários
npm run test:e2e       # Testes end-to-end
npm run test:cov       # Testes com coverage
npm run lint           # Linting
npm run format         # Formatação de código
npm run studio         # Prisma Studio
```

<br /><br />

## Funcionalidades

- EsLint e Prettier para melhor organização e padronização do projeto
- Containerização com Docker para facilitar a execução da aplicação
- Persistência em banco de dados utilizando volumes
- Banco de dados separados para execução dos testes
- Validação e tipagem de variáveis ambientes com Zod
- Ferramentas para testes pré-configuradas (Vitest)
- Sistema de logs detalhado e estruturado com Winston
- Rate limiting para proteção contra abusos (Throttler)
- Health check endpoints para monitoramento
- Respostas padronizadas com metadados
- Validação avançada de arquivos no upload
- Documentação completa via Swagger
- Proteção contra ataques de força bruta
- Monitoramento de saúde do banco de dados
- Sistema de notificações automáticas por email
- Cron jobs para tarefas agendadas
- Upload de arquivos para Cloudflare R2
- Autenticação JWT com chaves RSA
- Relacionamentos complexos entre entidades
- Filtros avançados e paginação
- Validação de dados com Class Validator
- Interceptors para logging e transformação de respostas
- Guards para proteção de rotas
- Middleware personalizado para autenticação
