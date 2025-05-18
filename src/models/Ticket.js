const { Sequelize } = require("sequelize");
const sequelize = require("../../db");
const Colaborator = require('./Colaborator.js');
const Client = require('./Client.js');

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
        references: {
            model: 'clients',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    colaboratorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'colaborator',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    category: {
        type: Sequelize.ENUM('conta', 'pagamento', 'entrega', 'produto', 'outros'),
        allowNull: false
    },
    priority: {
        allowNull: false,
        type: Sequelize.ENUM('baixa', 'media', 'alta'),
    },
    status: {
        allowNull: false,
        type: Sequelize.ENUM('aberto', 'andamento', 'resolvido', 'fechado'),
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

Ticket.associate = function(models) {
    Ticket.belongsTo(Client, {
        foreignKey: 'clientId',
        as: 'client'
    });
    
}

Ticket.associate = function(models) {
    Ticket.belongsTo(Colaborator, {
        foreignKey: 'colaboratorId',
        as: 'colaborator'
    });
    
}

module.exports = Ticket;