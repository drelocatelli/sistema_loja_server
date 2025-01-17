const { Sequelize } = require('sequelize');
const { config } = require('dotenv');
const mysql = require('mysql2')

config(); // Carrega variáveis de ambiente

// Valida variáveis de ambiente essenciais
['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_DIALECT'].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente ${key} não definida.`);
  }
});

async function createDb() {
  try {
    const conn = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    })
    
    conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

    console.log('Banco de dados criado com sucesso!');
    conn.end();
  } catch(err) {
    console.error('Erro ao criar banco de dados');
    console.error(err);
  }
}

createDb();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false, // Desativa logs SQL
});

module.exports = sequelize;
