const {DataTypes} = require('sequelize');
const sequelize = require('../../db.js');

const Sale = sequelize.define('sales', {
    serial: {
        type: DataTypes.STRING,
        allowNull: false
    },
    produto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    client_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    colaborator_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total: {
        type: DataTypes.FLOAT,
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

module.exports = Sale;