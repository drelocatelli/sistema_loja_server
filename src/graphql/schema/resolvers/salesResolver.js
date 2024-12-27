const authMiddleware = require('../../../middlewares/loginMiddleware');
const Category = require('../../../models/Category');
const Client = require('../../../models/Client');
const Colaborator = require('../../../models/Colaborator');
const Sale = require('../../../models/Sale');
const { Op } = require('sequelize');
const { checkEntityExists } = require('../../../utils');

module.exports = {
    Query: {
        getSales: authMiddleware(async (_, {page = 1, pageSize = 7, searchTerm = null, deleted = false}) => {
            const offset = (page - 1) * pageSize;

            const props = {
                order: [['created_at', 'ASC']],
                limit: pageSize,
                offset,
                include: [
                    {model: Client},
                    {model: Colaborator},
                    {model: Category}
                ]
            }

            const condition = {};

            if(searchTerm && searchTerm.length != 0) {
                condition.name = {[Op.like] : `%${searchTerm}%`};
            }

            if(!deleted) {
                condition.deleted_at = {[Op.eq] : null};
            }

            props.where = condition;

            const {count, rows} = await Sale.findAndCountAll(props);

            const totalPages = Math.ceil(count / pageSize);

            const data = {
                sales: rows,
                pagination: {
                    totalRecords: count,
                    totalPages: totalPages,
                    currentPage: page,
                    pageSize: pageSize
                }
            }
            
            return data; 
        }),
        getSale: authMiddleware(async (_, {id}) => {
            return await Sale.findByPk(id, {
                include: [
                    {model: Client},
                    {model: Colaborator},
                    {model: Category}
                ]
            });
        })
    },

    Mutation: {
        createSale: authMiddleware(async (_, {input}) => {
            const client = await Client.findByPk(input.client_id);
            const colaborator = await Colaborator.findByPk(input.colaborator_id);
            const category = await Category.findByPk(input.category_id);

            await checkEntityExists(client, 'Cliente');
            await checkEntityExists(colaborator, 'Colaborador');
            await checkEntityExists(category, 'Categoria');

            const sale = await Sale.create(input);

            return sale;
        }),
    }
};