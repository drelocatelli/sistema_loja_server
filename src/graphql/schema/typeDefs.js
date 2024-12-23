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

    type Login {
        id: ID!
        password: String!
    }

    type LoginResponse {
        error: Boolean!
        message: String!
        data: Login
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
        deleteClient(id: ID!): Client
        deleteClients(ids: [ID!]): [Client]

        login(password: String!): LoginResponse

    }
`;

module.exports = typeDefs;