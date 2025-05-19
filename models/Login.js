const {Sequelize} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const Login = sequelize.define('login', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        colaborator_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: true,
            references: {
                model: 'colaborator',
                key: 'id'
            },
            onDelete: 'SET NULL'
        },
        role: {
            type: DataTypes.ENUM('colaborator', 'manager', 'admin'),
            defaultValue: 'colaborator'
        }
    },
    {
        tableName: 'login',
        timestamps: false,
    });

    Login.associate = function (models) {
        Login.belongsTo(models.colaborator, { foreignKey: 'colaborator_id' });
    }

    return Login;
}


