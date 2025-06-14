import { DataTypes } from 'sequelize';

const module = (sequelize, DataTypes) => {
    const Customer = sequelize.define('customers', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true, 
            autoIncrement: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clientId: {
            type: DataTypes.INTEGER,
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

export default module;