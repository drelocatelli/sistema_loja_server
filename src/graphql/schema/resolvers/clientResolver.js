const Client = require('../../../models/Client');

module.exports = {
    Query: {
        getClients: async () => {
            return await Client.findAll();
        },
        getClient: async (_, {id}) => {
            return await Client.findByPk(id);
        }
    },

    Mutation: {
        createClient: async (_, {name, email, rg, cpf, phone, address, cep, city, state, country}) => {
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
        },
        updateClient: async (_, {id, name, email, rg, cpf, phone, address, cep, city, state, country}) => {
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
        },
        deleteClient: async (_, {id}) => {
            const client = await Client.findByPk(id);

            if(!client) {
                throw new Error('Client not found!');
            }

            client.deleted_at = new Date();

            await client.save();
            // await client.destroy();
            return `Client with ID ${id} deleted successfully.`;
        }
    }
}