const Customer = require("../../../models/Customer");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Client = require("../../../models/Client");
const sequelize = require("../../../../db");

module.exports = {
    Query: {},
    Mutation: {
        createCustomer: async(_, {input}) => {
            if(input.password != input.confirmPassword) {
                throw new Error('Senhas não conferem!')
            } 

            // checa se o cliente ja existe
            const clientExists = await Client.findOne({where: {email : input.client.email}});
            if(clientExists) {
                throw new Error('O cliente já foi cadastrado!');
            }
            const transaction = await sequelize.transaction();

            try {
                // Cria o cliente
                const client = await Client.create(input.client, {transaction: transaction});

                // Cria o cliente (Customer) com o ID do client
                const customer = await Customer.create({
                    password: await bcrypt.hash(input.password, 10),
                    clientId: client.id
                }, {transaction: transaction});

                // Commit da transação
                await transaction.commit();
                
                return client;
            } catch (error) {
                await transaction.rollback();
                throw new Error('Erro ao criar o cliente ou o customer: ' + error.message);
            }
        }
    }
};