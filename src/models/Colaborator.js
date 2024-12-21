const {DataTypes} = require('sequelize');
const sequelize = require('../../db.js');

const Colaborator = sequelize.define('colaborator', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rg: {
        type: DataTypes.STRING,
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

module.exports = Colaborator;