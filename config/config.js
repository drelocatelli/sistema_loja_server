const dotenv = require('dotenv');
dotenv.config();

const dev = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // host: '127.0.0.1',
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  // port: '3306'
  port: process.env.DB_PORT
}

module.exports = {
  development: dev,
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_test`,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT

  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: `${process.env.DB_NAME}_prod`,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT

  },
};
