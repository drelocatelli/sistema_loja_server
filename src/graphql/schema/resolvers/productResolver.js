const authMiddleware = require("../../../middlewares/loginMiddleware");
const { checkEntityExists, getImagesFromFolder, getPropsResponse } = require("../../../utils");
const models = require('../../../../models');

async function getProducts(_, {page = 1, pageSize = 7, searchTerm = null, deleted = false, orderBy = 'created_at', orderType = 'ASC', onlyPublished = false}) {

    const props = getPropsResponse({
        page,
        pageSize,
        searchTerm,
        deleted,
        orderBy,
        orderType,
        hasDeleted: true,
    });

    props.include = [
        {model: models.categories},
    ];

    props.where = {
        ...props.where,
        is_published: true, 
    }

    let {count, rows} = await models.products.scope('withAttributes').findAndCountAll(props);

    const totalPages = Math.ceil(count / pageSize);

    rows = await Promise.all(
        rows.map(async (product) => {
            product['photos'] = await getImagesFromFolder(product.id, 'products');
            return product;
        })
    );


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
}

module.exports = {
    Query: {
        getProducts: authMiddleware(async (_, {page = 1, pageSize = 7, searchTerm = null, deleted = false, orderBy = 'created_at', orderType = 'ASC', onlyPublished = false}) => {
            const data = await getProducts(_, {page, pageSize, searchTerm, deleted, orderBy, orderType, onlyPublished});
            return data; 
        }),
        getPublicProducts: async (_, {page = 1, pageSize = 7, searchTerm = null, orderBy = 'created_at', orderType = 'ASC'}) => {
            const data = await getProducts(_, {page, pageSize, searchTerm, orderBy, deleted: false, orderType, onlyPublished: true});
            return data;
        },
        getProduct: (async (_, {id}) => {
            return await models.products.findByPk(id, {
                include: [
                    {model: models.categories},
                ]
            });
        })
    },

    Mutation: {
        createProduct: authMiddleware(async (_, {input}) => {
            const category = await models.categories.findByPk(input.category_id);

            await checkEntityExists(category, 'Categoria');

            const productRequest = await models.products.create(input);
            const product = await models.products.findByPk(productRequest.id, {
                include: [
                    {model: models.categories},
                ]
            })

            return product;
        }),
        updateProduct: authMiddleware(async (_, {input}) => {
            
            const product = await models.products.findByPk(input.id, {
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
            const product = await models.products.findByPk(id, {
                include: [
                    {model: models.categories},
                ]
            });

            await checkEntityExists(product, 'Produto');    

            product.deleted_at = new Date();

            await product.save();

            return `Product with ID ${id} deleted successfully.`;
            
        })
    }
}