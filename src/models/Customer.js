const {DataTypes, Sequelize} = require('sequelize');
const sequelize = require("../../db");
const Client =  require('./Client.js');

const Customer = sequelize.define('customers', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true, 
        autoIncrement: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
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
    }
}, {
    timestamps: false
});

Customer.associate = function(models) {
    Customer.belongsTo(Client, {
        foreignKey: 'clientId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
}

module.exports = Customer;