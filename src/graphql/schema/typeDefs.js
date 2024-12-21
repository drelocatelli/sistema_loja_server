const {gql} = require('apollo-server');

const typeDefs = gql `
    type Colaborator {
        id: ID!
        name: String!
        email: String!
        role: String!
        rg: String!
        created_at: String
        updated_at: String
        deleted_at: String
    } 

    type Client {
        id: ID!
        name: String!
        email: String!
        rg: String
        cpf: String
        phone: String
        address: String
        cep: String
        city: String
        state: String
        country: String
        created_at: String
        updated_at: String
        deleted_at: String
    }

    type Query {
        getColaborators: [Colaborator]
        getColaborator(id: ID!): Colaborator

        getClients: [Client]
        getClient(id: ID!): Client
    }

    type Mutation {
        createColaborator(name: String!, email: String!, role: String!, rg: String!): Colaborator
        updateColaborator(id: ID!, name: String, email: String, role: String, rg: String): Colaborator
        deleteColaborator(id: ID!): String

        createClient(name: String!, email: String!, rg: String, cpf: String, phone: String, address: String, cep: String, city: String, state: String, country: String): Client
        updateClient(id: ID!, name: String, email: String, rg: String, cpf: String, phone: String, address: String, cep: String, city: String, state: String, country: String): Client
        deleteClient(id: ID!): String
    }
`;

module.exports = typeDefs;