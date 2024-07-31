# Dockerfile
FROM node:lts

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia o package.json e o package-lock.json
COPY package*.json ./

# Instala as dependências do projeto
RUN yarn install

# Copia o restante do código da aplicação
COPY . .

# Compila a aplicação
RUN yarn build

# Expõe a porta que a aplicação irá rodar
EXPOSE ${APP_PORT}

# Comando para rodar a aplicação
CMD ["yarn", "start:dev"]
