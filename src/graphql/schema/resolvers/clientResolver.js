const { Op } = require('sequelize');
const Client = require('../../../models/Client');
const authMiddleware = require('../../../middlewares/loginMiddleware');

module.exports = {
    Query: {
        getClients: authMiddleware(async (_, {page = 1, pageSize = 7, searchTerm = null, deleted = false}) => {
            const offset = (page - 1) * pageSize;

            const props = {
                order: [['name', 'ASC']],
                limit: pageSize,
                offset,
            };

            const condition = {};

            if(searchTerm && searchTerm.length != 0) {
                condition.name = {[Op.like] : `%${searchTerm}%`};
            }

            if(!deleted) {
                condition.deleted_at = {[Op.eq] : null};
            }

            props.where = condition;
            
            const {count, rows} = await Client.findAndCountAll(props);

            const totalPages = Math.ceil(count / pageSize);

            const data = {
                clients: rows,
                pagination: {
                    totalRecords: count,
                    totalPages: totalPages,
                    currentPage: page,
                    pageSize: pageSize
                }
            };

            return data;
        }),

        getClient: authMiddleware(async (_, {id}) => {
            return await Client.findByPk(id);
        })
    },

    Mutation: {
        createClient: authMiddleware(async (_, {name, email, rg, cpf, phone, address, cep, city, state, country}, context) => {
            if(!context.user) {
                throw new Error('Usuário não autenticado!');
            }

            const newClient = await Client.create({
                name,
                email,
                rg,
                cpf,
                phone,
                address,
                cep,
                city,
                state,
                country
            });


            return newClient;
        }),
        updateClient: authMiddleware(async (_, {id, name, email, rg, cpf, phone, address, cep, city, state, country}) => {
            const client = await Client.findByPk(id);

            if(!client) {
                throw new Error('Client not found!');
            }

            client.name = name || client.name;
            client.email = email || client.email;
            client.rg = rg || client.rg;
            client.cpf = cpf || client.cpf;
            client.phone = phone || client.phone;
            client.address = address || client.address;
            client.cep = cep || client.cep;
            client.city = city || client.city;
            client.state = state || client.state;
            client.country = country || client.country; 

            await client.save();

            return client;
        }),
        deleteClient: authMiddleware(async (_, {id}) => {
            const client = await Client.findByPk(id);

            if(!client) {
                throw new Error('Cliente não encontrado!');
            }

            client.deleted_at = new Date();

            await client.save();

            return client;
        }),
        deleteClients: authMiddleware(async (_, {ids}) => {
            const clients = await Client.findAll({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });

            const deletedClients = [];

            clients.forEach(async (client) => {
                client.deleted_at = new Date();
                deletedClients.push(client);
                await client.save();
            }); 

            return deletedClients;
        })
    }
}