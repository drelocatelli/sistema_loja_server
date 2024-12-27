const {DataTypes} = require('sequelize');
const sequelize = require('../../db.js');
const Category = require('./Category.js');

const Product = sequelize.define('products', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_published: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
},
{
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
});
Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Product