const {Sequelize, DataTypes} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const FavoriteProduct = sequelize.define('favorite_products', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        clientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'clients',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'NO ACTION'
        },
    }, {
        timestamps: true
    });

    FavoriteProduct.associate = (models) => {
        FavoriteProduct.belongsTo(models.products, { foreignKey: 'productId' });
        FavoriteProduct.belongsTo(models.clients, { foreignKey: 'clientId' });
    }

    return FavoriteProduct;
};