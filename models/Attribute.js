const {Sequelize} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Attribute = sequelize.define("Attribute", {
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
    }, {
        timestamps: false,
        tableName: 'attributes'
    })

    Attribute.associate = (models) => {
        Attribute.hasMany(models.AttributeValue, { foreignKey: 'attribute_id', as: 'values' });
     }
    return Attribute;
}