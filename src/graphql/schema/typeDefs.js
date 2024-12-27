const {gql} = require('apollo-server-express');

const typeDefs = gql `
    type Colaborator {
        id: ID!
        name: String!
        email: String!
        role: String!
        rg: String!
        date_of_birth: String!
        marital_status: String!
        gender: String!
        full_address: String!
        created_at: String
        updated_at: String
        deleted_at: String
    } 

    type ColaboratorResponse {
        colaborators: [Colaborator]
        pagination: PaginationInfo
    }

    input ColaboratorInput {
        name: String!
        email: String!
        role: String!
        rg: String!
        cpf: String
        date_of_birth: String!
        marital_status: String!
        gender: String!
        full_address: String!
        created_at: String
        updated_at: String
        deleted_at: String
    } 

    input ColaboratorUpdateInput {
        id: ID!
        name: String
        email: String
        role: String
        rg: String
        cpf: String
        date_of_birth: String
        marital_status: String
        gender: String
        full_address: String
        created_at: String
        updated_at: String
        deleted_at: String
    }

    type Client {
        id: ID!
        name: String!
        email: String
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

    type PaginationInfo {
        totalRecords: Int!
        totalPages: Int!
        currentPage: Int!
        pageSize: Int!
    }

    type ClientsResponse {
        clients: [Client]
        pagination: PaginationInfo
    }

    type Login {
        id: ID!
        password: String!
    }

    type LoginResponse {
        error: Boolean!
        message: String!
        token: String
    }

    type Category {
        id: ID!
        name: String!
    }

    type CategoriesResponse {
        categories: [Category]
        pagination: PaginationInfo
    }

    type Sale {
        id: ID!
        serial: String!
        client: Client!
        colaborator: Colaborator!
        category: Category!
        total: Float!
    }

    input SalesInput {
        serial: String!
        client: ID!
        colaborator: ID!
        category: ID!
        total: Float!
    }

    type Query {
        getColaborators(page: Int, pageSize: Int, searchTerm: String, deleted: Boolean): ColaboratorResponse
        getColaborator(id: ID!): Colaborator

        getClients(page: Int, pageSize: Int, searchTerm: String, deleted: Boolean): ClientsResponse
        getClient(id: ID!): Client

        getSales: [Sale]
        getSale(id: ID!): Sale
        
        getCategories(page: Int, pageSize: Int, searchTerm: String, deleted: Boolean): CategoriesResponse
        getAllCategories(deleted: Boolean): [Category]
        getCategory(id: ID!): Category
    }

    type Mutation {
        createColaborator(input: ColaboratorInput!): Colaborator
        updateColaborator(input: ColaboratorUpdateInput!): Colaborator
        deleteColaborator(id: ID!): String

        createClient(name: String!, email: String, rg: String, cpf: String, phone: String, address: String, cep: String, city: String, state: String, country: String): Client
        updateClient(id: ID!, name: String, email: String, rg: String, cpf: String, phone: String, address: String, cep: String, city: String, state: String, country: String): Client
        deleteClient(id: ID!): Client
        deleteClients(ids: [ID!]): [Client]

        login(password: String!): LoginResponse

        createCategory(name: String!): Category
        updateCategory(id: ID!, name: String): Category
        deleteCategory(id: ID!): String

        createSale(input: SalesInput!): Sale
        updateSale(id: ID!, serial: String, client: ID, colaborator: ID, category: ID, Value: Float): Sale
        deleteSale(id: ID!): String
    }
`;

module.exports = typeDefs;