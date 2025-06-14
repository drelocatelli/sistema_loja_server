import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import mysql from 'mysql2';

config(); // Carrega variáveis de ambiente

// Valida variáveis de ambiente essenciais
['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_DIALECT', 'DB_PORT'].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente ${key} não definida.`);
  }
});

async function createDb() {
  try {
    const conn = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT // <-- Aqui
    });

    conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``); // safer with backticks
    console.log('Banco de dados criado com sucesso!');
    conn.end();
  } catch (err) {
    console.error('Erro ao criar banco de dados');
    console.error(err);
  }
}

createDb();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // <-- Aqui também
  dialect: process.env.DB_DIALECT,
  logging: false,
});

module.exports = sequelize;
