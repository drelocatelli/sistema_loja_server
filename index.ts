import { ApolloServer } from 'apollo-server-express';
import typeDefs from './src/graphql/schema/typeDefs';
import resolvers from './src/graphql/schema/resolvers';
import sequelize from './db';
import uploadController from './controllers/uploadController';
import express from 'express';
import path from 'path';
import cors from 'cors';

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
 app.use(express.urlencoded({ extended: false }));

 
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
