const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../db");
const Colaborator = require('./Colaborator');
const Client = require('./Client');

const Ticket = sequelize.define('tickets', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
    },
    colaboratorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM('conta', 'pagamento', 'entrega', 'produto', 'outros'),
        allowNull: false
    },
    priority: {
        allowNull: false,
        type: DataTypes.ENUM('baixa', 'media', 'alta'),
    },
    status: {
        allowNull: false,
        type: DataTypes.ENUM('aberto', 'andamento', 'resolvido', 'fechado'),
        defaultValue: 'aberto'
    },
    createdAt: {
        allowNull: false,
        type: Sequelize.DATE
    },
    updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
    },
});

Ticket.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Ticket.belongsTo(Colaborator, { foreignKey: 'colaboratorId', as: 'colaborator' });

module.exports = Ticket;