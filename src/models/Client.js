const { Sequelize } = require("sequelize");
const sequelize = require("../../db.js");

const Client = sequelize.define('clients', {
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
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rg: {
        type: Sequelize.STRING,
        allowNull: true
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: true
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    address: {
        type: Sequelize.STRING,
        allowNull: true
    },
    cep: {
        type: Sequelize.STRING,
        allowNull: true
    },
    city: {
        type: Sequelize.STRING,
        allowNull: true
    },
    state: {
        type: Sequelize.STRING,
        allowNull: true
    },
    country: {
        type: Sequelize.STRING,
        allowNull: true
    },
    deleted_at: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
});

module.exports = Client;