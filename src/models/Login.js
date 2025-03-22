const {DataTypes, Sequelize} = require('sequelize');
const sequelize = require('../../db.js');
const Colaborator = require('./Colaborator.js');

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

Login.belongsTo(Colaborator, { foreignKey: 'colaborator_id' });

module.exports = Login;