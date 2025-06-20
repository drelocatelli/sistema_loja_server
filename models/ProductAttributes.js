const models = require("../models")

module.exports = (sequelize, DataTypes) => {
    const ProductAttributes = sequelize.define('ProductAttribute', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id'
            }
        },
        attribute_value_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'attribute_values',
                key: 'id'
            }
        }
    }, {
        timestamps: false,
    });

    return ProductAttributes;
}