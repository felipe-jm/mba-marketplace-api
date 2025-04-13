# MBA Marketplace API

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![PNPM](https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=flat&logo=swagger&logoColor=black)](https://swagger.io/)

Uma robusta API de backend para marketplace construída com NestJS e Prisma, oferecendo autenticação de usuários, gerenciamento de produtos, upload de arquivos e análises detalhadas.

## Índice

- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Primeiros Passos](#primeiros-passos)
  - [Pré-requisitos](#pré-requisitos)
  - [Instalação](#instalação)
  - [Configuração de Ambiente](#configuração-de-ambiente)
  - [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
- [Desenvolvimento](#desenvolvimento)
  - [Executando a API](#executando-a-api)
  - [Gerenciamento do Banco de Dados](#gerenciamento-do-banco-de-dados)
  - [Testes](#testes)
- [Documentação da API](#documentação-da-api)
  - [Documentação Swagger](#documentação-swagger)
- [Funcionalidades e Regras](#funcionalidades-e-regras)

## Funcionalidades

- Autenticação e gerenciamento de usuários
- Criação, listagem e gerenciamento de produtos
- Upload e armazenamento de arquivos
- Categorização de produtos
- Gerenciamento do ciclo de vida do status do produto
- Métricas e análises detalhadas
- Cobertura abrangente de testes

## Stack Tecnológica

- **Framework**: NestJS
- **ORM de Banco de Dados**: Prisma
- **Banco de Dados**: PostgreSQL
- **Container**: Docker
- **Gerenciador de Pacotes**: PNPM
- **Testes**: Jest

## Primeiros Passos

### Pré-requisitos

- Node.js (v16+)
- PNPM
- Docker e Docker Compose

### Instalação

```bash
# Clone o repositório
git clone https://github.com/felipe-jm/mba-marketplace-api.git
cd mba-marketplace-api

# Instale as dependências
pnpm install
```

### Configuração de Ambiente

```bash
# Crie os arquivos de ambiente a partir dos exemplos
cp .env.example .env
cp .env.test.example .env.test

# Edite os arquivos .env com sua configuração
```

### Configuração do Banco de Dados

```bash
# Inicie o container do banco de dados
docker compose up -d
```

## Desenvolvimento

### Executando a API

```bash
# Gere o cliente Prisma
npx prisma generate

# Execute as migrações do banco de dados
npx prisma migrate dev

# Inicie o servidor de desenvolvimento
pnpm run start:dev
```

### Gerenciamento do Banco de Dados

```bash
# Abra o Prisma Studio (interface visual do banco de dados)
npx prisma studio
```

### Testes

```bash
# Execute os testes
pnpm run test

# Execute os testes com cobertura
pnpm run test:cov
```

## Documentação da API

A API é documentada usando Swagger/OpenAPI, fornecendo uma documentação abrangente e interativa.

### Documentação Swagger

Após iniciar o servidor, a documentação Swagger está disponível em:

```
http://localhost:3333/api
```

A interface do Swagger oferece os seguintes recursos:

- Lista completa de endpoints da API com descrições detalhadas
- Exemplos de requisição e resposta
- Modelos de esquema para todos os DTOs e entidades
- Recursos interativos de teste (experimente)
- Suporte de autenticação para endpoints protegidos

Para usar a documentação Swagger:

1. Inicie o servidor de desenvolvimento: `pnpm run start:dev`
2. Abra um navegador e acesse `http://localhost:3333/api`
3. Explore os endpoints disponíveis
4. Para rotas protegidas, clique no botão "Authorize" e insira seu token JWT

Você também pode exportar a especificação OpenAPI como JSON:

```
http://localhost:3333/api-json
```

Ou como YAML:

```
http://localhost:3333/api-yaml
```

## Funcionalidades e Regras

- [x] Deve ser possível cadastrar novos usuários
  - [x] Deve ser feito o hash da senha do usuário
  - [x] Não deve ser possível cadastrar usuário com e-mail duplicado
  - [x] Não deve ser possível cadastrar usuário com telefone duplicado
- [x] Deve ser possível atualizar os dados do usuário
  - [x] Deve ser feito o hash da senha do usuário
  - [x] Não deve ser possível atualizar para um e-mail duplicado
  - [x] Não deve ser possível atualizar para um telefone duplicado
- [x] Deve ser possível obter o token de autenticação
  - [x] Não deve ser possível se autenticar com credenciais incorretas
- [x] Deve ser possível realizar o upload de arquivos
- [x] Deve ser possível criar e editar um Produto
  - [x] Deve ser possível armazenar o valor do produto em centavos
  - [x] Não deve ser possível criar/editar um Produto com um usuário inexistente
  - [x] Não deve ser possível criar/editar um Produto com uma categoria inexistente
  - [x] Não deve ser possível criar/editar um Produto com imagens inexistentes
  - [x] Não deve ser possível editar um Produto inexistente
  - [x] Não deve ser possível alterar um Produto de outro usuário
  - [x] Não deve ser possível editar um Produto já vendido
- [x] Deve ser possível obter dados de um Produto
  - [x] Qualquer usuário deve poder obter dados do Produto
- [x] Deve ser possível listar todas as categorias
  - [x] Qualquer usuário deve poder obter a lista de categorias
- [x] Deve ser possível listar todos os produtos por ordem de criação (mais recente)
  - [x] Qualquer usuário deve poder obter a lista de produtos
  - [x] Deve ser possível realizar paginação pela lista de produtos
  - [x] Deve ser possível filtrar pelo Status
  - [x] Deve ser possível buscar pelo título ou pela descrição do produto
- [x] Deve ser possível listar todos os produtos de um usuário
  - [x] Não deve ser possível listar os produtos de um usuário inexistente
  - [x] Deve ser possível filtrar pelo Status
  - [x] Deve ser possível buscar pelo título ou pela descrição do produto
- [x] Deve ser possível alterar o Status do Produto
  - [x] Não deve ser possível alterar o Status de um Produto com um usuário inexistente
  - [x] Não deve ser possível alterar o Status de um Produto inexistente
  - [x] Não deve ser possível alterar o Status de um Produto de outro usuário
  - [x] Não deve ser possível marcar como Cancelado um Produto já Vendido
  - [x] Não deve ser possível marcar como Vendido um Produto Cancelado
- [x] Deve ser possível obter informações do perfil de um usuário
  - [x] Não deve ser possível obter informações do perfil de um usuário inexistente
  - [x] Não deve ser possível obter a senha do usuário
- [x] Deve ser possível registrar uma visualização em um produto
  - [x] Não deve ser possível registrar uma visualização em um produto inexistente
  - [x] Não deve ser possível registrar uma visualização de um usuário inexistente
  - [x] Não deve ser possível registrar uma visualização do próprio dono do produto
  - [x] Não deve ser possível registrar uma visualização duplicada
- [x] Métricas
  - [x] Não deve ser possível obter métricas de usuários inexistentes
  - [x] Deve ser possível obter a métrica de produtos vendidos nos últimos 30 dias
  - [x] Deve ser possível obter a métrica de produtos disponíveis nos últimos 30 dias
  - [x] Deve ser possível obter a métrica de visualizações nos últimos 30 dias
  - [x] Deve ser possível obter a métrica de visualizações por dia dos últimos 30 dias
  - [x] Deve ser possível obter a métrica de visualizações de um produto nos últimos 7 dias
