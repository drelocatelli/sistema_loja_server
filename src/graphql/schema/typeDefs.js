const {gql} = require('apollo-server');

const typeDefs = gql `
    type Colaborator {
        id: ID!
        name: String!
        email: String!
        role: String!
        rg: String!
    } 

    type Query {
        getColaborators: [Colaborator]
        getColaborator(id: ID!): Colaborator
    }

    type Mutation {
        createColaborator(name: String!, email: String!, role: String!, rg: String!): Colaborator
        updateColaborator(id: ID!, name: String, email: String, role: String, rg: String): Colaborator
        deleteColaborator(id: ID!): String
    }
`;

module.exports = typeDefs;