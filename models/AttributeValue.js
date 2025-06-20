module.exports = (sequelize, DataTypes) => {
  const AttributeValue = sequelize.define(
    'AttributeValue',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      attribute_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'attributes',
          key: 'id',
        },
      },
    },
    {
      timestamps: false,
    }
  );

  AttributeValue.associate = (models) => {
    AttributeValue.belongsTo(models.Attribute, {
      foreignKey: 'attribute_id',
    });

    AttributeValue.belongsToMany(models.products, {
      through: 'product_attributes',
      foreignKey: 'attribute_value_id',
      otherKey: 'product_id',
    });
  };

  return AttributeValue;
};
