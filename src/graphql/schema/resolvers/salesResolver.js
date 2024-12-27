const authMiddleware = require('../../../middlewares/loginMiddleware');
const Client = require('../../../models/Client');
const Colaborator = require('../../../models/Colaborator');
const Sale = require('../../../models/Sale');
const Product = require('../../../models/Product');
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
                    {model: Product},
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
                    {model: Product},
                ]
            });
        })
    },

    Mutation: {
        createSale: authMiddleware(async (_, {input}) => {
            const client = await Client.findByPk(input.client_id);
            const colaborator = await Colaborator.findByPk(input.colaborator_id);

            await checkEntityExists(client, 'Cliente');
            await checkEntityExists(colaborator, 'Colaborador');

            const saleRequest = await Sale.create(input);
            const sale = await Sale.findByPk(saleRequest.id, {
                include: [
                    {model: Client},
                    {model: Colaborator},
                    {model: Product},

                ]
            });

            return sale;
        }),

        updateSale: authMiddleware(async (_, {input}) => {
            const client = await Client.findByPk(input.client_id);
            const colaborator = await Colaborator.findByPk(input.colaborator_id);

            await checkEntityExists(client, 'Cliente');
            await checkEntityExists(colaborator, 'Colaborador');

            const sale = await Sale.findByPk(input.id, {
                include: [
                    {model: Client},
                    {model: Colaborator},
                    {model: Product},

                ]
            });

            await checkEntityExists(sale, 'Venda');

            sale.serial = input.serial || sale.serial;
            sale.product_id = input.product_id || sale.product_id;
            sale.description = input.description || sale.description;
            sale.client_id = input.client_id || sale.client_id;
            sale.colaborator_id = input.colaborator_id || sale.colaborator_id;
            sale.total = input.total || sale.total;

            await sale.save();

            return sale;

        }),
        deleteSale: authMiddleware(async (_, {id}) => {
            const sale = await Sale.findByPk(id);

            await checkEntityExists(sale, 'Venda');

            sale.deleted_at = new Date();
            await sale.save();

            return `Sale with ID ${id} deleted successfully.`;
        })
    }
};