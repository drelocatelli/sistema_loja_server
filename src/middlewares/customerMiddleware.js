const jwt = require('jsonwebtoken');
const models = require('../../models');

const customerAuthMiddleware = (resolve) => async (parent, args, context, info) => {
    const token = context.req.headers.authorization?.split(' ')[1];

    if(!token) {
        throw new Error('É necessário estar autenticado');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const customerLoggedIn = await models.clients.findOne({
            where: {
                id: decoded.userId
            },
            include: [
                {
                    model: models.customers
                }
            ]
        });

        context.customerLoggedIn = customerLoggedIn;

        return resolve(parent, args, context, info);
    } catch(err) {
        console.error(err);
        throw new Error('Sessão expirada. Faça login novamente.');
    }

}

module.exports = customerAuthMiddleware;