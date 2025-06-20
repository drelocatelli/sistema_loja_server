
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
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        timestamps: false,
        tableName: 'product_attributes'
    });

    return ProductAttributes;
}