# Use a imagem oficial do Node.js
FROM node:16

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia apenas os arquivos de dependência primeiro
COPY api/package*.json ./

# Instala as dependências dentro do container
RUN npm install

RUN npm rebuild bcrypt --build-from-source

# Copia o restante dos arquivos do projeto
COPY api/ .

# Exponha a porta do NestJS
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:dev"]