# Use uma imagem base oficial do Node.js
FROM node:16

# Crie e defina o diretório de trabalho
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json
COPY frontend/package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todo o código da aplicação para o container
COPY frontend/ .

# Exponha a porta que o React vai rodar
EXPOSE 3000

# Execute o comando para rodar a aplicação React
CMD ["npm", "start"]
