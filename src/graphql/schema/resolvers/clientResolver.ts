import { Op } from 'sequelize';
import authMiddleware from '@middlewares/loginMiddleware';
import models from '@models';


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
            
            const {count, rows} = await models.clients.findAndCountAll({
                ...props,
                include: [
                    {
                        model: models.customers,
                    }
                ]
            });

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
            return await models.clients.findByPk(id);
        })
    },

    Mutation: {
        createClient: authMiddleware(async (_, {name, email, rg, cpf, phone, address, cep, city, state, country}, context) => {
            if(!context.user) {
                throw new Error('Usuário não autenticado!');
            }

            if (!address || typeof address !== 'string') {
                throw new Error('Endereço inválido!');
            }

            const newClient = await models.clients.create({
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
            const client = await models.clients.findByPk(id);

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
            const client = await models.clients.findByPk(id);

            if(!client) {
                throw new Error('Cliente não encontrado!');
            }

            client.deleted_at = new Date();

            await client.save();

            return client;
        }),
        deleteClients: authMiddleware(async (_, {ids}) => {
            const clients = await models.clients.findAll({
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