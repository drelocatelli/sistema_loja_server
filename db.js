const { Sequelize } = require('sequelize');
const { config } = require('dotenv');

config(); // Carrega variáveis de ambiente

// Valida variáveis de ambiente essenciais
['DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_DIALECT'].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente ${key} não definida.`);
  }
});

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false, // Desativa logs SQL
});

const createDB = async () => {
  try {
    // Primeira tentativa de conexão sem banco (com um Sequelize separado)
    const createDbSequelize = new Sequelize({
      dialect: process.env.DB_DIALECT,
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      logging: false,
    });

    try {
      // Testa a conexão sem banco
      await createDbSequelize.authenticate();
      console.log('Conexão com o servidor de banco de dados estabelecida com sucesso.');

      // Verifica se o banco de dados existe, caso contrário cria
      try {
        await createDbSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
        console.log(`Banco de dados "${process.env.DB_NAME}" garantido ou criado com sucesso.`);
      } catch (dbError) {
        console.error('Erro ao criar o banco de dados:', dbError);
      }

      // Fecha a conexão de criação do banco
      await createDbSequelize.close();

      // Agora que o banco existe, conecta-se a ele
      await sequelize.authenticate();
      console.log('Conexão com o banco de dados estabelecida com sucesso.');

      // Sincroniza tabelas
      await sequelize.sync();
      console.log('Tabelas sincronizadas com sucesso.');
    } catch (err) {
      console.error('Erro ao conectar ao servidor de banco de dados:', err);
    }
  } catch (err) {
    console.error('Erro ao tentar criar a conexão inicial:', err);
  } finally {
    await sequelize.close();
  }
};

// Executa a função
// createDB();

module.exports = sequelize;
