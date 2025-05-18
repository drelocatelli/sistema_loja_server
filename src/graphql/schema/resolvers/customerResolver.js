const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require("../../../../db");
const customerAuthMiddleware = require("../../../middlewares/customerMiddleware");
const models = require('../../../../models');

async function authenticate(email, password) {
    const client = await models.clients.findOne({
        where: {
            email: email
        },
        include: [
            {
                model: models.customers
            }
        ]
    });

    if(!client) {
        throw new Error('Cliente não existe!');
    }

    console.log('Cliente tentou entrar:', client.id, ('nome: ' + client.name))


    const dbPass = (client.customer.password).toString();
    const passwordMatch = await bcrypt.compare(password, dbPass);

    if(!passwordMatch) {
        throw new Error('Senha incorreta!');
    }

    console.log('Cliente entrou:', client.id, ('nome: ' + client.name))

    return client;
}

module.exports = {
    Query: {
        loginCustomer: async(_, {email, password}, {res}) => {
            
            const client = await authenticate(email, password);

            const token = jwt.sign({
                userId: client.id,
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: '30d'
            });

            return {token};
            
        },
        getCustomerLoggedIn: customerAuthMiddleware(async(_, __, context) => {
            const {customerLoggedIn} = context;
            const client = await models.clients.findByPk(customerLoggedIn.id, {
                include: [
                    {
                        model: models.customers
                    }
                ]
            });

            if(!client) {
                throw new Error('Client nao encontrado!');
            }

            return client;
        })
    },
    Mutation: {
        createCustomer: async(_, {input}) => {
            if(input.password != input.confirmPassword) {
                throw new Error('Senhas não conferem!')
            } 

            // checa se o cliente ja existe
            const clientExists = await models.clients.findOne({where: {email : input.client.email}});
            if(clientExists) {
                throw new Error('O cliente já foi cadastrado!');
            }
            const transaction = await sequelize.transaction();

            try {
                // Cria o cliente
                const client = await models.clients.create(input.client, {transaction: transaction});

                // Cria o cliente (Customer) com o ID do client
                const hashedPassword = await bcrypt.hash(input.password, 10);
                const customer = await models.customers.create({
                    password: hashedPassword,
                    clientId: client.id
                }, {transaction: transaction});

                // Commit da transação
                await transaction.commit();
                
                return client;
            } catch (error) {
                await transaction.rollback();
                throw new Error('Erro ao criar o cliente ou o customer: ' + error.message);
            }
        },

        updateCostumer: customerAuthMiddleware(async(_, {input}, context) => {
            const {customerLoggedIn} = context;
            
            const client = await models.clients.findByPk(customerLoggedIn.id, {
                include: [
                    {
                        model: models.customers
                    }
                ]
            });

            if(!client) {
                throw new Error('Client não encontrado!');
            }

            const passwordMatch = (input.newPassword === input.confirmPassword);

            if(!passwordMatch) {
                throw new Error('Senhas não conferem!');
            }

            delete input.client.email;
            delete input.client.name;

            const dataToUpdate = Object.fromEntries(
                Object.entries(input.client).filter(([_, value]) => value !== null)
            );
            
            return client.update(dataToUpdate);
        }),
    }
};