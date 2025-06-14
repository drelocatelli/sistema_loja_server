import { Sequelize } from "sequelize";
import { hideMail } from "../src/utils";
const module = (sequelize, DataTypes) => {

    const Client = sequelize.define('clients', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('email');
                return hideMail(rawValue);
            }
        },
        rg: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cep: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        // defaultScope: {
        //     attributes: { exclude: ['email'] }
        // }
    });

    Client.associate = function(models) {
        Client.hasOne(models.customers, {
            foreignKey: 'clientId',
        });
        
        Client.hasMany(models.tickets, {
            foreignKey: 'clientId',
            as: 'tickets'
        })

        Client.hasMany(models.comments, {
            foreignKey: 'authorId',
            constraints: false,
            scope: {
                authorType: 'client'
            },
            as: 'comments'
        });

        Client.hasMany(models.favorite_products, {
            foreignKey: 'clientId',
        });
    }


    return Client;
};

export default module;