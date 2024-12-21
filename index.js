const {ApolloServer} = require('apollo-server');
const typeDefs = require('./src/graphql/schema/typeDefs');
const resolvers = require('./src/graphql/schema/resolvers');
const sequelize = require('./db');

const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  formatResponse(response) {
    return {
      data: response.data
    }
  }
 });

sequelize.sync().then(() => {
    console.log('Database synced successfully');
  });
  
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});