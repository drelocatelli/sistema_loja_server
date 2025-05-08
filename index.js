const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./src/graphql/schema/typeDefs');
const resolvers = require('./src/graphql/schema/resolvers');
const sequelize = require('./db');
const uploadController = require('./controllers/uploadController');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
// app.use(cors({
//   origin: '*', // Altere para o domínio permitido, se necessário
//   methods: ['GET', 'POST', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.options('*', cors());

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

 app.use(express.json());
 
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
