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
                required: true,
                where: {
                  is_published: true
                },
                orderBy: [
                  ['created_at', 'DESC']
                ]
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
    }),
    getProductsFavoritedByIds: customerAuthMiddleware(async (_, { ids }, context) => {
      const clientId = context.customerLoggedIn.id;
      
      const query = await models.favorite_products.findAll({
        where: {
          clientId,
          productId: {
            [Op.in]: ids
          }
        }
      });
      
      if(!query) {
        throw new Error('Nenhum produto favoritado encontrado');
      }
      
      return query;

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
        await existingFavorite.destroy();
        return false;
      }
      
      const favoriteProduct = await models.favorite_products.create(payload);
      const favoriteProductRes = await models.favorite_products.findByPk(favoriteProduct.id, {
        include: [
          {
            model: models.products,
            as: 'product',
            required: true,
            where: {
              is_published: true
            },
            orderBy: [
              ['created_at', 'DESC']
            ]
          },
          {
            model: models.clients,
            as: 'client',
            required: true,
          },
        ],
      });

      return true;
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
