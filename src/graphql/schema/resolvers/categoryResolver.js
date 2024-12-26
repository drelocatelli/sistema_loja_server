const authMiddleware = require('../../../middlewares/loginMiddleware');
const Category = require('../../../models/Category');
const { Op } = require('sequelize');

module.exports = {
    Query: {
        getCategories: authMiddleware(async (_, {page = 1, pageSize = 7, searchTerm = null, deleted = false}) => {
            const offset = (page - 1) * pageSize;

            const props = {
                order: [['name', 'ASC']],
                limit: pageSize,
                offset,
            };

            const condition = {};

            if(searchTerm && searchTerm.length != 0) {
                condition.name = {[Op.like] : `%${searchTerm}%`};
            }

            if(!deleted) {
                condition.deleted_at = {[Op.eq] : null};
            }

            props.where = condition;
            
            const {count, rows} = await Category.findAndCountAll(props);

            const totalPages = Math.ceil(count / pageSize);

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
        }),
        getCategory: authMiddleware(async (_, {id}) => {
            return await Category.findByPk(id);
        })
    },

    Mutation: {
        createCategory: authMiddleware(async (_, {name, description}) => {
            const category = await Category.create({name, description});
            return category;
        }),
        updateCategory: authMiddleware(async (_, {id, name, description}) => {
            const category = await Category.findByPk(id);

            if(!category) {
                throw new Error('Category not found!');
            }

            category.name = name || category.name;
            category.description = description || category.description;

            await category.save();

            return category;
        }),
        deleteCategory: authMiddleware(async (_, {id}) => {
            const category = await Category.findByPk(id);            

            if(!category) {
                throw new Error('Category not found!');
            }

            category.deleted_at = new Date();
            await category.save();
            return `Category with ID ${id} deleted successfully.`;
        })
    }
}