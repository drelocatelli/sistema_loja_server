const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('categories', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: false
        },
        deleted_at: {
            type: Sequelize.DATE,
            allowNull: true
        }
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    }
    );

    return Category;
};