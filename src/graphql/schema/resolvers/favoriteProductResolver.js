const { Op } = require('sequelize');
const customerAuthMiddleware = require('../../../middlewares/customerMiddleware');
const models = require('../../../../models');
const { getPropsResponse } = require('../../../utils');

module.exports = {
  Query: {
    getFavoriteProducts: customerAuthMiddleware(async (_, { page = 1, pageSize = 7 }, context) => {
        const props = getPropsResponse({
            orderBy: 'createdAt',
            page,
            pageSize
        });

        const include = [
            {
                model: models.products,
                as: 'product',
                required: true
            },
            {
                model: models.clients,
                as: 'client',
                required: true
            }
        ];

        props.include = include;

        const {count, rows} = await models.favorite_products.findAndCountAll(props);

        const totalPages = Math.ceil(count / pageSize);

        return {
            favoriteProducts: rows,
            pagination: {
                totalRecords: count,
                totalPages: totalPages,
                currentPage: page,
                pageSize: pageSize
            }
        }
    })
  },
  Mutation: {
    createFavoriteProduct: customerAuthMiddleware(async (_, { input }, context) => {
      const { productId } = input;
      const clientId = context.customerLoggedIn.id;

      const payload = {
        productId,
        clientId,
      };

    const product = await models.products.findByPk(productId);
    
    if (!product) {
      throw new Error('Produto nao encontrado');
    }

    const existingFavorite = await models.favorite_products.findOne({
        where: {
          clientId: clientId,
          productId: productId
        }
      });

      if (existingFavorite) {
        throw new Error('Produto já está favoritado por este cliente.');
      }
      
      const favoriteProduct = await models.favorite_products.create(payload);
      const favoriteProductRes = await models.favorite_products.findByPk(favoriteProduct.id, {
        include: [
          {
            model: models.products,
            as: 'product',
            required: true,
          },
          {
            model: models.clients,
            as: 'client',
            required: true,
          },
        ],
      });

      return favoriteProductRes;
    }),
    deleteFavoriteProduct: customerAuthMiddleware(async (_, { id }, context) => {
      const favoriteProduct = await models.favorite_products.findByPk(id);
      if (!favoriteProduct) {
        throw new Error('Produto não encontrado');
      }
      await favoriteProduct.destroy();
      return 'Produto deletado com sucesso!';
    })
  },
};
