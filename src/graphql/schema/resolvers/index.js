const colaboratorResolver = require('./colaboratorResolver');
const clientResolver = require('./clientResolver');
const loginResolver = require('./loginResolver');

const resolvers = {
  Query: {
    ...colaboratorResolver.Query,
    ...clientResolver.Query,
    ...loginResolver.Query
  },
  Mutation: {
    ...colaboratorResolver.Mutation,
    ...clientResolver.Mutation,
    ...loginResolver.Mutation
  },
};

module.exports = resolvers;
