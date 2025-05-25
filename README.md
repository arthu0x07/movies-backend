# Projeto Back End - Cubos

API para projeto técnico da Cubos Academy <br /><br />

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
- Envio de E-mails
- Upload de imagens

<br /><br />

## Descrição

- (Preencher)

<br /><br />

## Variáveis de Ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente nos seus .env's

`DATABASE_URL` - _URL utilizada para se conectar com o banco de dados. (termina com @postgres:5432)_

`PORT` - _Porta específica para rodar a aplicação, caso não passe nenhuma, a 3333 será o padrão._

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

## Funcionalidades

- EsLint e Prettier para melhor organização e padronização do projeto.

- Containerização com Docker para facilitar a execução da aplicação.

- Persistência em banco de dados utilizando volumes.

- Banco de dados separados para execução dos testes.

- Validação e tipagem de variáveis ambientes.

- Ferramentas para testes pré-configuradas.
