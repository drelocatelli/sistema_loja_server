const {Sequelize} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const OrderProductVariation = sequelize.define('order_product_variation', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        sale_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'sales',
                key: 'id'
            },
            onDelete: 'CASCADE',
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id'
            },
            onDelete: 'CASCADE',
        },
        attribute_value_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'attribute_values',
                key: 'id'
            },
            onDelete: 'CASCADE',
        }
    },
    {
        timestamps: false,
    });

    OrderProductVariation.associate = (models) => {
        OrderProductVariation.belongsTo(models.sales, { foreignKey: 'sale_id' });
        OrderProductVariation.belongsTo(models.products, { foreignKey: 'product_id' });
        OrderProductVariation.belongsTo(models.AttributeValue, { foreignKey: 'attribute_value_id' });
    };

    return OrderProductVariation;
}