const colaboratorResolver = require('./colaboratorResolver');
const clientResolver = require('./clientResolver');

const resolvers = {
  Query: {
    ...colaboratorResolver.Query,
    ...clientResolver.Query,
  },
  Mutation: {
    ...colaboratorResolver.Mutation,
    ...clientResolver.Mutation,
  },
};

module.exports = resolvers;
