const authMiddleware = require('../../../middlewares/loginMiddleware');
const customerAuthMiddleware = require('../../../middlewares/customerMiddleware');
const models = require('../../../../models');
const { getPropsResponse } = require("../../../utils");

module.exports = {
    Query: {
        getTickets: authMiddleware(async (_, {page = 1, pageSize = 7}) => {
            
            const props = getPropsResponse({
                orderBy: 'createdAt',
                page,
                pageSize
            });
            
            const include = [
                {
                    model: models.clients,
                    as: 'client',
                    required: true
                },
                {
                    model: models.colaborator,
                    as: 'colaborator',
                }
            ];
            props.include = include;

            
            const {count, rows} = await models.tickets.findAndCountAll(props);

            const totalPages = Math.ceil(count / pageSize);

            return {
                tickets: rows,
                pagination: {
                    totalRecords: count,
                    totalPages,
                    currentPage: page,
                    pageSize
                }
            };
        }),
        getTicketsCustomerLoggedIn: customerAuthMiddleware(async(_, {page = 1, pageSize = 7, orderBy = 'createdAt', orderType = 'ASC'}, context) => {
            const props = getPropsResponse({
                orderBy,
                orderType,
                page,
                pageSize
            });

            console.log(orderBy, orderType)

            props.where = {
                ...props.where,
                clientId: context.customerLoggedIn.id
            };

            const include = [
                {
                    model: models.colaborator,
                    as: 'colaborator',
                },
                {
                    model: models.clients,
                    as: 'client',
                    required: true
                }
            ];

            props.include = include;

            console.log({props: props.order})
            
            const {count, rows: tickets} = await models.tickets.findAndCountAll(props);

            const totalPages = Math.ceil(count / pageSize);

            return {
                tickets,
                pagination: {
                    totalRecords: count,
                    totalPages,
                    currentPage: page,
                    pageSize
                }
            };
        }),
        getTicketById: customerAuthMiddleware(async (_, args, context) => {
            const {id} = args.input;

            const ticket = await models.tickets.findByPk(id, {
                where: {
                    clientId: context.customerLoggedIn.id,
                },
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
            return ticket;
        })
    },
    Mutation: {
        createTicket: customerAuthMiddleware(async (_, {input}, context) => {
            const clientId = context.customerLoggedIn.id;
            if (input.priority === undefined) {
                delete input.priority;
            }
            if (input.status === undefined) {
                delete input.status;
            }
            if (input.colaboratorId === undefined) {
                delete input.colaboratorId;
            }
            
            input.clientId = clientId;

            const created = await models.tickets.create(input);
            const ticket = await models.tickets.findByPk(created.id, {
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

            return ticket;
        }),
        updateTicketStatus: authMiddleware(async (_, {input}) => {
            const ticket = await models.tickets.findByPk(input.id);
            ticket.status = input.status;
            await ticket.save();

            return ticket;
        }),
    }
};