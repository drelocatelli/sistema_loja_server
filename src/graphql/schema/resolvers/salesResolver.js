const authMiddleware = require('../../../middlewares/loginMiddleware');
const Sale = require('../../../models/Sale');
const { Op } = require('sequelize');

module.exports = {
    Query: {
    },

    Mutation: {
        createSale: authMiddleware(async (_, {input}) => {
            const sale = await Sale.create(input);
            return sale;
        }),
    }
};