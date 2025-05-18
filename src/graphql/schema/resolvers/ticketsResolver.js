const authMiddleware = require('../../../middlewares/loginMiddleware');
const customerAuthMiddleware = require('../../../middlewares/customerMiddleware');
const Ticket = require('../../../models/Ticket');
const Client = require('../../../models/Client');
const Colaborator = require('../../../models/Colaborator');

module.exports = {
    Query: {
        getTickets: authMiddleware(async (_, {input}) => {
            const tickets = await Ticket.findAll({
                include: [
                    {
                        model: Client,
                        as: 'client',
                        required: true
                    },
                    {
                        model: Colaborator,
                        required: false,
                        as: 'colaborator'
                    }
                ]
            });
            return tickets;
        }),
        getTicketsCustomerLoggedIn: customerAuthMiddleware(async(_, {input}, context) => {
            const tickets = await Ticket.findAll({
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