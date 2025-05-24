# Etapa de construção
FROM node:latest AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos necessários
COPY package*.json ./
COPY prisma ./prisma/
COPY . .

# Instalar dependências e construir a aplicação
RUN npm install
RUN npm run build

# Etapa final
FROM node:latest

# Definir diretório de trabalho
WORKDIR /app

# Copiar dependências e código construído
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expor a porta da aplicação
EXPOSE 3000

# Comando de inicialização
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db push && npm run start:prod"]