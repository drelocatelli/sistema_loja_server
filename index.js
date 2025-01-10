const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./src/graphql/schema/typeDefs');
const resolvers = require('./src/graphql/schema/resolvers');
const sequelize = require('./db');
const uploadController = require('./controllers/uploadController');
const express = require('express');
const path = require('path');

const app = express();
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
  server.applyMiddleware({app, path: '/'});
  sequelize.sync().then(() => {
      console.log('Database synced successfully');
    });
    
  app.listen(4000, () =>
    console.log(`Servidor GraphQL rodando em http://localhost:4000${server.graphqlPath}`)
  );
}
 
startServer();
