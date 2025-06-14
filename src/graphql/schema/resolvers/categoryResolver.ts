import authMiddleware from '../../../middlewares/loginMiddleware';
import { Op } from 'sequelize';
import models from '../../../../models';

module.exports = {
    Query: {
        getAllCategories: async (_, deleted = false) => {
            if(!deleted) {
                return await models.categories.findAll({where: {deleted_at: null}});
            }

            return await models.categories.findAll();
          
        },
        getCategories: async (_, {page = 1, pageSize = null, searchTerm = null, deleted = false}) => {
            const props = {
                order: [['name', 'ASC']],
            };

            if(pageSize != null) {
                const offset = (page - 1) * pageSize;
                props.offset = offset;
                props.limit = pageSize;
            }

            const condition = {};

            if(searchTerm && searchTerm.length != 0) {
                condition.name = {[Op.like] : `%${searchTerm}%`};
            }

            if(!deleted) {
                condition.deleted_at = {[Op.eq] : null};
            }

            props.where = condition;
            
            const {count, rows} = await models.categories.findAndCountAll(props);

            const totalPages = pageSize != null ? Math.ceil(count / pageSize) : 1;
            pageSize = pageSize != null ? pageSize : 1;

            const data = {
                categories: rows,
                pagination: {
                    totalRecords: count,
                    totalPages: totalPages,
                    currentPage: page,
                    pageSize: pageSize
                }
            }

            return data;
        },
        getCategory: async (_, {id}) => {
            return await models.categories.findByPk(id);
        }
    },

    Mutation: {
        createCategory: authMiddleware(async (_, {name, description}) => {
            const category = await models.categories.create({name, description});
            return category;
        }),
        updateCategory: authMiddleware(async (_, {id, name, description}) => {
            const category = await models.categories.findByPk(id);

            if(!category) {
                throw new Error('Category not found!');
            }

            category.name = name || category.name;
            category.description = description || category.description;

            await category.save();

            return category;
        }),
        deleteCategory: authMiddleware(async (_, {id}) => {
            const category = await models.categories.findByPk(id);            

            if(!category) {
                throw new Error('Category not found!');
            }

            category.deleted_at = new Date();
            await category.save();
            return `Category with ID ${id} deleted successfully.`;
        })
    }
}