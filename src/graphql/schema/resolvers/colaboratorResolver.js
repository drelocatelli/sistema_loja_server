const authMiddleware = require('../../../middlewares/loginMiddleware');
const models = require('../../../../models');
const { Op } = require('sequelize');

module.exports = {
    Query: {
        getColaborators: authMiddleware(async (_, {page = 1, pageSize = 7, searchTerm = null, deleted = false, isAssigned = null}) => {

            const offset = (page - 1) * pageSize;

            const props = {
                order: [['name', 'ASC']],
                limit: pageSize,
                offset,
                include: [
                    {
                        model: models.login,
                        required: false
                    }
                ]
            }
            
            const condition = {};

            if(searchTerm && searchTerm.length != 0) {
                condition.name = {[Op.like] : `%${searchTerm}%`};
            }
            
            if(deleted) {
                condition.deleted_at = {[Op.ne] : null};
            } else {
                condition.deleted_at = {[Op.eq] : null};
            }

            if (isAssigned === true) {
                condition['$login.colaborator_id$'] = { [Op.ne]: null }; // Apenas colaboradores COM login
            } else if (isAssigned === false) {
                condition['$login.colaborator_id$'] = { [Op.is]: null }; // Apenas colaboradores SEM login
            }

            props.where = condition;

            const {count, rows} = await models.colaborator.findAndCountAll(props);

            const totalPages = Math.ceil(count / pageSize);

            const data = {
                colaborators: rows,
                pagination: {
                    totalRecords: count,
                    totalPages: totalPages,
                    currentPage: page,
                    pageSize: pageSize
                }
            }
            
            return data;
        }),
        getColaborator: authMiddleware(async (_, {id}) => {
            return await models.colaborator.findByPk(id);
        })
    },

    Mutation: {
        createColaborator: authMiddleware(async (_, {input}) => {
            const newColaborator = await models.colaborator.create(input);

            return newColaborator;
        }),

        updateColaborator: authMiddleware(async (_, {input}) => {
            const colaborator = await models.colaborator.findByPk(input.id);

            if(!colaborator) {
                throw new Error('Colaborator não encontrado!');
            }

            colaborator.name = input.name || colaborator.name;
            colaborator.email = input.email || colaborator.email;
            colaborator.rg = input.rg || colaborator.rg;

            await colaborator.save();
            
            return colaborator;
        }),

        deleteColaborator: authMiddleware(async (_, {id}) => {
            const colaborator = await models.colaborator.findByPk(id);

            if(!colaborator) {
                throw new Error('Colaborator não encontrado!');
            }

            colaborator.deleted_at = new Date();
            await colaborator.save();
            return `Colaborator with ID ${id} deleted successfully.`;
        })
    }
}