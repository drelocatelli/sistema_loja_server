const jwt = require('jsonwebtoken');
const Client = require('../../models/Client');
const Customer = require('../../models/Customer');

const customerAuthMiddleware = (resolve) => async (parent, args, context, info) => {
    const token = context.req.headers.authorization?.split(' ')[1];

    if(!token) {
        throw new Error('É necessário estar autenticado');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const customerLoggedIn = await Client.findOne({
            where: {
                id: decoded.userId
            },
            include: [
                {
                    model: Customer
                }
            ]
        });

        context.customerLoggedIn = customerLoggedIn;

        return resolve(parent, args, context, info);
    } catch(err) {
        throw new Error('Sessão expirada. Faça login novamente.');
    }

}

module.exports = customerAuthMiddleware;