const { Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {

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
            allowNull: true
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
    }


    return Client;
};