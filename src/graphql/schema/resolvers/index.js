const colaboratorResolver = require('./colaboratorResolver');
const clientResolver = require('./clientResolver');
const loginResolver = require('./loginResolver');
const categoryResolver = require('./categoryResolver');
const salesResolver = require('./salesResolver');
const productResolver = require('./productResolver');
const customerResolver = require('./customerResolver');
const ticketsResolver = require('./ticketsResolver');

const resolvers = {
  Query: {
    ...colaboratorResolver.Query,
    ...clientResolver.Query,
    ...categoryResolver.Query,
    ...salesResolver.Query,
    ...productResolver.Query,
    ...customerResolver.Query,
    ...ticketsResolver.Query,
  },
  Mutation: {
    ...colaboratorResolver.Mutation,
    ...clientResolver.Mutation,
    ...loginResolver.Mutation,
    ...categoryResolver.Mutation,
    ...salesResolver.Mutation,
    ...productResolver.Mutation,
    ...customerResolver.Mutation,
    ...ticketsResolver.Mutation,

  },
};

module.exports = resolvers;
