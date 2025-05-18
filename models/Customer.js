const {Sequelize} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
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
        Customer.belongsTo(models.clients, {
            foreignKey: 'clientId',
        });
    }

    return Customer;
    
};