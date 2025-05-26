const {gql} = require('apollo-server-express');

const typeDefs = gql `
    type Colaborator {
        id: ID!
        name: String!
        email: String!
        rg: String!
        date_of_birth: String!
        marital_status: String!
        gender: String!
        full_address: String!
        login: Login
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
        customer: Customer
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
        role: String!
        colaborator_id: ID
        user: String!
        colaborator: Colaborator
    }

    type LoginResponse {
        error: Boolean!
        message: String!
        token: String
        details: Login
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
        product: Product!
        description: String
        total: Float!
        created_at: String
        updated_at: String
        deleted_at: String
        date: String
    }

    type SalesResponse {
        sales: [Sale]
        pagination: PaginationInfo
    }

    input SalesInput {
        serial: String!
        product_id: ID!
        description: String
        colaborator_id: ID!
        client_id: ID!
        total: Float!
    }

    input SalesUpdateInput {
        id: ID!
        serial: String
        product_id: ID
        description: String
        colaborator_id: ID!
        client_id: ID!
        total: Float
    }

    type Product {
        id: ID!
        photos: [String]
        name: String!
        description: String
        category: Category!
        price: Float!
        quantity: Int!
        is_published: Boolean!
        deleted_at: String
        created_at: String
        updated_at: String
    }

    type ProductsResponse {
        products: [Product]
        pagination: PaginationInfo
    }
    
    type TicketsResponse {
        tickets: [Ticket]
        pagination: PaginationInfo
    }

    type Customer {
        id: ID!
        client: Client
    }

    type CustomerLogin {
        token: String!
    }

    type Ticket {
        id: ID!
        clientId: Int!
        colaboratorId: Int
        title: String!
        description: String!
        category: TicketCategory!
        priority: TicketPriority!
        status: TicketStatus!
        createdAt: String!
        updatedAt: String!
        client: Client
        colaborator: Colaborator
    }
    
    type TicketWithComments {
        ticket: Ticket
        comments: [ClientComment]
    }

    type Author {
        name: String!
    }

    type ClientComment {
        id: ID!
        commentableType: String!
        commentableId: ID!
        authorId: ID!
        authorType: String!
        content: String!
        author: Author
        createdAt: String!
        updatedAt: String!
        deletedAt: String
    }
    
    enum TicketCategory {
        conta
        pagamento
        entrega
        produto
        outros
    }

    enum TicketPriority {
        baixa
        media
        alta
    }

    enum TicketStatus {
        aberto
        andamento
        resolvido
        fechado
    }

    input ProductInput {
        name: String!
        description: String
        category_id: ID!
        price: Float!
        quantity: Int!
        is_published: Boolean!
    }

    input ClientInput {
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
    }

    input ProductUpdateInput {
        id: ID!
        name: String
        description: String
        category_id: ID
        price: Float
        quantity: Int
        is_published: Boolean
    }

    input CustomerInput {
        password: String!
        confirmPassword: String!
        client: ClientInput
    }

    input UpdateClientInput {
        name: String
        rg: String
        cpf: String
        phone: String
        address: String
        cep: String
        city: String
        state: String
        country: String
    }

    input UpdateCustomerInput {
        newPassword: String
        confirmPassword: String
        client: UpdateClientInput
    }

    input TicketInput {
        title: String!
        description: String!
        category: TicketCategory!
    }

    input TicketUpdateInput {
        id: ID!
        status: TicketStatus!
    }

    input GetTicketByIdInput {
        id: ID!
    }

    input TicketCommentInput {
        ticketId: ID!
        content: String!
    }

    type Query {
        getColaborators(page: Int, pageSize: Int, searchTerm: String, deleted: Boolean, isAssigned: Boolean, showAll: Boolean): ColaboratorResponse
        getColaborator(id: ID!): Colaborator

        getClients(page: Int, pageSize: Int, searchTerm: String, deleted: Boolean): ClientsResponse
        getClient(id: ID!): Client

        getSales(page: Int, pageSize: Int, searchTerm: String, deleted: Boolean): SalesResponse
        getSale(id: ID!): Sale
        
        getCategories(page: Int, pageSize: Int, searchTerm: String, deleted: Boolean): CategoriesResponse
        getAllCategories(deleted: Boolean): [Category]
        getCategory(id: ID!): Category

        getProducts(page: Int, pageSize: Int, searchTerm: String, deleted: Boolean, orderBy: String, orderType: String, onlyPublished: Boolean): ProductsResponse
        getPublicProducts(page: Int, pageSize: Int, searchTerm: String, orderBy: String, orderType: String): ProductsResponse
        getProduct(id: ID!): Product

        loginCustomer(email: String! password: String!): CustomerLogin
        getCustomerLoggedIn: Client

        getTickets(page: Int, pageSize: Int): TicketsResponse
        getTicketsCustomerLoggedIn(page: Int, pageSize: Int, orderBy: String, orderType: String, status: TicketStatus): TicketsResponse
        getTicketById(input: GetTicketByIdInput): TicketWithComments
    }

    type Mutation {
        createColaborator(input: ColaboratorInput!): Colaborator
        updateColaborator(input: ColaboratorUpdateInput!): Colaborator
        deleteColaborator(id: ID!): String

        createClient(name: String!, email: String, rg: String, cpf: String, phone: String, address: String, cep: String, city: String, state: String, country: String): Client
        updateClient(id: ID!, name: String, email: String, rg: String, cpf: String, phone: String, address: String, cep: String, city: String, state: String, country: String): Client
        deleteClient(id: ID!): Client
        deleteClients(ids: [ID!]): [Client]

        login(user: String!, password: String!): LoginResponse
        assignColaboratorToUser(userId: ID!, colaboratorId: ID!): Login

        createCategory(name: String!): Category
        updateCategory(id: ID!, name: String): Category
        deleteCategory(id: ID!): String

        createSale(input: SalesInput!): Sale
        updateSale(input: SalesUpdateInput!): Sale
        deleteSales(ids: [ID!]): String

        createProduct(input: ProductInput!): Product
        updateProduct(input: ProductUpdateInput!): Product
        deleteProduct(id: ID!): String

        createCustomer(input: CustomerInput!): Client
        updateCostumer(input: UpdateCustomerInput!): Client

        updateTicketStatus(input: TicketUpdateInput!): Ticket
        createTicket(input: TicketInput!): Ticket
        createTicketComment(input: TicketCommentInput!): ClientComment
    }
`;

module.exports = typeDefs;