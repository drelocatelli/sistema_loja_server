const authMiddleware = require('../../../middlewares/loginMiddleware');
const customerAuthMiddleware = require('../../../middlewares/customerMiddleware');
const Ticket = require('../../../models/Ticket');

module.exports = {
    Query: {
        getTickets: authMiddleware(async (_, {input}) => {
            const tickets = await Ticket.findAll();
            return tickets;
        }),
        getTicketsCustomerLoggedIn: customerAuthMiddleware(async(_, {input}, context) => {
            const tickets = await Ticket.findAll({
                where: {
                    client_id: context.customerLoggedIn.id
                }
            });
            return tickets;
        })
    },
    Mutation: {
        
    }
};