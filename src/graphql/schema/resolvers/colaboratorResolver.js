const authMiddleware = require('../../../middlewares/loginMiddleware');
const Colaborator = require('../../../models/Colaborator');
const Login = require('../../../models/Login');
const { Op } = require('sequelize');

module.exports = {
    Query: {
        getColaborators: authMiddleware(async (_, {page = 1, pageSize = 7, searchTerm = null, deleted = false, isAssigned = true}) => {

            const offset = (page - 1) * pageSize;

            const props = {
                order: [['name', 'ASC']],
                limit: pageSize,
                offset,
                include: [
                    {
                        model: Login,
                        required: isAssigned,
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

            props.where = condition;

            const {count, rows} = await Colaborator.findAndCountAll(props);

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
            return await Colaborator.findByPk(id);
        })
    },

    Mutation: {
        createColaborator: authMiddleware(async (_, {input}) => {
            const newColaborator = await Colaborator.create(input);

            return newColaborator;
        }),

        updateColaborator: authMiddleware(async (_, {input}) => {
            const colaborator = await Colaborator.findByPk(input.id);

            if(!colaborator) {
                throw new Error('Colaborator not found!');
            }

            colaborator.name = input.name || colaborator.name;
            colaborator.email = input.email || colaborator.email;
            colaborator.rg = input.rg || colaborator.rg;

            await colaborator.save();
            
            return colaborator;
        }),

        deleteColaborator: authMiddleware(async (_, {id}) => {
            const colaborator = await Colaborator.findByPk(id);

            if(!colaborator) {
                throw new Error('Colaborator not found!');
            }

            colaborator.deleted_at = new Date();
            await colaborator.save();
            return `Colaborator with ID ${id} deleted successfully.`;
        })
    }
}