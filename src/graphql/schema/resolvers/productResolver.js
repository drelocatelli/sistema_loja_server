const authMiddleware = require("../../../middlewares/loginMiddleware");
const Category = require('../../../models/Category')
const Product = require('../../../models/Product');
const { checkEntityExists } = require("../../../utils");

module.exports = {
    Query: {
        getProducts: authMiddleware(async (_, {page = 1, pageSize = 7, searchTerm = null, deleted = false}) => {
            const offset = (page - 1) * pageSize;

            const props = {
                order: [['created_at', 'ASC']],
                limit: pageSize,
                offset,
                include: [
                    {model: Category},
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

            const {count, rows} = await Product.findAndCountAll(props);

            const totalPages = Math.ceil(count / pageSize);

            const data = {
                products: rows,
                pagination: {
                    totalRecords: count,
                    totalPages: totalPages,
                    currentPage: page,
                    pageSize: pageSize
                }
            }
            
            return data; 
        }),
        getProduct: authMiddleware(async (_, {id}) => {
            return await Product.findByPk(id, {
                include: [
                    {model: Category},
                ]
            });
        })
    },

    Mutation: {
        createProduct: authMiddleware(async (_, {input}) => {
            const category = await Category.findByPk(input.category_id);

            await checkEntityExists(category, 'Categoria');

            const productRequest = await Product.create(input);
            const product = await Product.findByPk(productRequest.id, {
                include: [
                    {model: Category},
                ]
            })

            return product;
        }),
        updateProduct: authMiddleware(async (_, {input}) => {
            const category = await Category.findByPk(input.category_id);

            await checkEntityExists(category, 'Categoria');
            
            const product = await Product.findByPk(input.id, {
                include: [
                    {model: Category},
                ]
            });

            await checkEntityExists(product, 'Produto');    

            product.name = input.name || product.name;
            product.description = input.description || product.description;
            product.category_id = input.category_id || product.category_id;
            product.price = input.price || product.price;
            product.quantity = input.quantity || product.quantity;
            product.is_published = input.is_published || product.is_published;

            await product.save();

            return product;
        }),
        deleteProduct: authMiddleware(async (_, {id}) => {
            const product = await Product.findByPk(id, {
                include: [
                    {model: Category},
                ]
            });

            await checkEntityExists(product, 'Produto');    

            product.deleted_at = new Date();

            await product.save();

            return `Product with ID ${id} deleted successfully.`;
            
        })
    }
}