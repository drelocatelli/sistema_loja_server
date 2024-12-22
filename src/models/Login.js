const {DataTypes} = require('sequelize');
const sequelize = require('../../db.js');

const Login = sequelize.define('login', {
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
},
{
    tableName: 'login',
    timestamps: false,
});

module.exports = Login;