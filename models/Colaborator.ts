import { Sequelize } from 'sequelize';

const module = (sequelize, DataTypes) => {
    const Colaborator = sequelize.define('colaborator', {
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
            allowNull: false
        },
        rg: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date_of_birth: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false
        },
        marital_status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false
        },
        full_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
    });
    
    Colaborator.associate = models => {
        Colaborator.hasMany(models.tickets, {
            foreignKey: 'colaboratorId',
            as: 'tickets'
          });
        Colaborator.hasOne(models.login, { foreignKey: 'colaborator_id' });

        Colaborator.hasMany(models.comments, {
            foreignKey: 'authorId',
            constraints: false,
            scope: {
                authorType: 'colaborator'
            },
            as: 'comments'
        });
    }
    return Colaborator;
}

export default module;