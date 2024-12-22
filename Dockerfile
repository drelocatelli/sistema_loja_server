# Use a imagem oficial do Node.js como base
FROM node:18

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o package.json e package-lock.json para o container
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie todos os arquivos do projeto para o diretório de trabalho do container
COPY . .

# Exponha a porta que o servidor irá rodar
EXPOSE 4000

# Comando para rodar a aplicação
CMD ["node", "index.js"]
