import { Sequelize } from 'sequelize';

const module = (sequelize, DataTypes) => {
    const Sale = sequelize.define('sales', {
        serial: {
            type: DataTypes.STRING,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        client_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        colaborator_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
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

    Sale.associate = (models) => {
        Sale.belongsTo(models.clients, { foreignKey: 'client_id' });
        Sale.belongsTo(models.colaborator, { foreignKey: 'colaborator_id' });
        Sale.belongsTo(models.products, { foreignKey: 'product_id' });
    };

    return Sale;
}
export default module;