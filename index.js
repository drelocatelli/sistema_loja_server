const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./src/graphql/schema/typeDefs');
const resolvers = require('./src/graphql/schema/resolvers');
const sequelize = require('./db');
const uploadController = require('./controllers/uploadController');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*', // Altere para o domínio permitido, se necessário
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: ({req}) => {
    return {
      req
    }
  }
 });

 app.use(express.static(path.resolve('public')));

 // routes
 app.use(uploadController);

async function startServer() {
  await server.start();
  server.applyMiddleware({app, path: '/graphql'});
  sequelize.sync().then(() => {
      console.log('Database synced successfully');
    });
    
  app.listen(process.env.PORT, () =>
    console.log(`Servidor GraphQL rodando em http://localhost:4000${server.graphqlPath}`)
  );
}
 
startServer();
