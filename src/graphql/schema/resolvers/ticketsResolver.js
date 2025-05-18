const authMiddleware = require('../../../middlewares/loginMiddleware');
const customerAuthMiddleware = require('../../../middlewares/customerMiddleware');
const models = require('../../../../models');

module.exports = {
    Query: {
        getTickets: authMiddleware(async (_, {input}) => {

            return models.tickets.findAll()
            
            // const modelstickets = await Ticket.findAll({
            //     include: [
            //         {
            //             model: Client,
            //             as: 'client',
            //             required: true
            //         },
            //         // {
            //         //     model: Colaborator,
            //         //     required: false,
            //         // }
            //     ]
            // });
            // return tickets;
        }),
        getTicketsCustomerLoggedIn: customerAuthMiddleware(async(_, {input}, context) => {
            const tickets = await models.tickets.findAll({
                where: {
                    clientId: context.customerLoggedIn.id
                }
            });
            return tickets;
        })
    },
    Mutation: {

    }
};