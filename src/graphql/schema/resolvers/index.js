const colaboratorResolver = require('./colaboratorResolver');
const clientResolver = require('./clientResolver');
const loginResolver = require('./loginResolver');
const categoryResolver = require('./categoryResolver');
const salesResolver = require('./salesResolver');
const productResolver = require('./productResolver');

const resolvers = {
  Query: {
    ...colaboratorResolver.Query,
    ...clientResolver.Query,
    ...categoryResolver.Query,
    ...salesResolver.Query,
    ...productResolver.Query
  },
  Mutation: {
    ...colaboratorResolver.Mutation,
    ...clientResolver.Mutation,
    ...loginResolver.Mutation,
    ...categoryResolver.Mutation,
    ...salesResolver.Mutation,
    ...productResolver.Mutation
  },
};

module.exports = resolvers;
