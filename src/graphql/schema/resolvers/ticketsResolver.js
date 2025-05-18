import authMiddleware from '../../../middlewares/loginMiddleware';
import Ticket from '../../../models/Ticket';

module.exports = {
    Query: {
        getTickets: authMiddleware(async (_, {input}) => {
            const tickets = await Ticket.findAll();

            return tickets;
        })
    }
};