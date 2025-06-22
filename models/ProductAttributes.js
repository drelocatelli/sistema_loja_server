module.exports = (sequelize, DataTypes) => {
  const ProductAttributes = sequelize.define(
    'ProductAttributes',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'products',
          key: 'id',
        },
      },
      attribute_value_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'attribute_values',
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: false,
      tableName: 'product_attributes',
    }
  );

  ProductAttributes.associate = (models) => {
    ProductAttributes.belongsTo(models.products, { foreignKey: 'product_id', as: 'product' });
    ProductAttributes.belongsTo(models.AttributeValue, {
      foreignKey: 'attribute_value_id',
      as: 'value',
    });
  };

  return ProductAttributes;
};
