const authMiddleware = require('../../../middlewares/loginMiddleware');
const Client = require('../../../models/Client');
const Colaborator = require('../../../models/Colaborator');
const Sale = require('../../../models/Sale');
const Product = require('../../../models/Product');
const { Op, Transaction } = require('sequelize');
const { checkEntityExists,getImagesFromFolder } = require('../../../utils');

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

            
            let {count, rows} = await Sale.findAndCountAll(props);
            
            rows = await Promise.all(
                rows.map(async (sale) => { 
                    sale.product['photos'] = await getImagesFromFolder(sale.product.id, 'products');
                    return sale; 
                })
            );

            const totalPages = Math.ceil(count / pageSize);

            let sales = Array.from(rows).map((sale) => {
                sale['date'] = new Date(sale.created_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                
                return sale;
            });

            const data = {
                sales,
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
        createSale: authMiddleware(async (_, { input }) => {
            const client = await Client.findByPk(input.client_id);
            const colaborator = await Colaborator.findByPk(input.colaborator_id);
        
            await checkEntityExists(client, 'Cliente');
            await checkEntityExists(colaborator, 'Colaborador');
        
            const transaction = await Sale.sequelize.transaction();
        
            try {
                console.log("Transaction started");
        
                // Create sale
                const saleRequest = await Sale.create(input, { transaction });
        
                // Update stock
                const product = await Product.findByPk(input.product_id, { transaction });
        
                if (!product) {
                    throw new Error('Produto não encontrado');
                }
        
                if (product.quantity <= 0) {
                    throw new Error('Estoque insuficiente');
                } else {
                    product.quantity -= input.total;
                    await product.save({ transaction });
                }
        
        
                // Fetch the created sale with associations
                const sale = await Sale.findByPk(saleRequest.id, {
                    include: [
                        { model: Client },
                        { model: Colaborator },
                        { model: Product },
                    ],
                    transaction, // Ensure the transaction is used here
                });
        
                if (!sale) {
                    throw new Error('Erro ao criar a venda');
                }
        
                // Commit the transaction only after successful operations
                await transaction.commit();
        
                return sale;
        
            } catch (err) {
                if (transaction && !transaction.finished) {
                    await transaction.rollback();
                }
                throw err;
            }
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
        deleteSales: authMiddleware(async (_, {ids}) => {
            const sales = await Sale.findAll({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            });

            sales.forEach(async(sale) => {
                sale.deleted_at = new Date();
                await sale.save();
            });

            return `Sales deleted successfully.`;
        })
    }
};