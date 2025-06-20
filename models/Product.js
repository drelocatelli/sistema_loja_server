const { Sequelize } = require('sequelize');
const models = require('../models');

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'products',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',
    }
  );

  Product.associate = (models) => {
    Product.belongsTo(models.categories, { foreignKey: 'category_id' });
    Product.hasMany(models.favorite_products, { foreignKey: 'productId' });

    Product.belongsToMany(models.Attribute, {
      through: models.ProductAttribute,
      foreignKey: 'product_id',
      otherKey: 'attribute_value_id',
      as: 'attributes',
    });

  };
  // Product.addScope('withAttributes', {
  //   include: [
  //     {
  //       model: models.Attribute,
  //       include: [
  //         {
  //           model: models.AttributeValue,
  //           as: "attribute_values",
  //         },
  //       ],
  //       through: {
  //         attributes: [], // não traz campos da pivot
  //       },
  //     },
  //   ],
  // });


  return Product;
};
