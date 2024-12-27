const colaboratorResolver = require('./colaboratorResolver');
const clientResolver = require('./clientResolver');
const loginResolver = require('./loginResolver');
const categoryResolver = require('./categoryResolver');
const salesResolver = require('./salesResolver');

const resolvers = {
  Query: {
    ...colaboratorResolver.Query,
    ...clientResolver.Query,
    ...categoryResolver.Query,
    ...salesResolver.Query
  },
  Mutation: {
    ...colaboratorResolver.Mutation,
    ...clientResolver.Mutation,
    ...loginResolver.Mutation,
    ...categoryResolver.Mutation,
    ...salesResolver.Mutation
  },
};

module.exports = resolvers;
