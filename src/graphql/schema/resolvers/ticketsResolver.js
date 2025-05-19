const authMiddleware = require('../../../middlewares/loginMiddleware');
const customerAuthMiddleware = require('../../../middlewares/customerMiddleware');
const models = require('../../../../models');

module.exports = {
    Query: {
        getTickets: authMiddleware(async (_, {input}) => {
            
            const tickets = await models.tickets.findAll({
                include: [
                    {
                        model: models.clients,
                        as: 'client',
                        required: true
                    },
                    {
                        model: models.colaborator,
                        as: 'colaborator',
                    }
                ]
            });
            return tickets;
        }),
        getTicketsCustomerLoggedIn: customerAuthMiddleware(async(_, {input}, context) => {
            const tickets = await models.tickets.findAll({
                where: {
                    clientId: context.customerLoggedIn.id
                },
                include: [
                    {
                        model: models.colaborator,
                        as: 'colaborator',
                    }
                ]
            });
            return tickets;
        })
    },
    Mutation: {
        createTicket: customerAuthMiddleware(async (_, {input}, context) => {
            const clientId = context.customerLoggedIn.id;
            input.clientId = clientId;
            
            const ticket = await models.tickets.create(input);
            return ticket;
        }),
    }
};