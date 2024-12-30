const { Sequelize } = require('sequelize');
const { config } = require('dotenv');

config(); // Carrega variáveis de ambiente

// Cria uma instância do Sequelize diretamente
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false, // Desliga o log do SQL
});

const createDB = async () => {
  try {
    // Testa a conexão com o banco de dados (isso pode lançar um erro se o banco não existir)
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Sincroniza as tabelas, criando-as no banco de dados
    await sequelize.sync({ force: false }); // `force: false` mantém os dados, mas cria as tabelas

    console.log('Tabelas sincronizadas com sucesso.');

  } catch (err) {
    if (err.message.includes('Unknown database')) {
      console.log(`Banco de dados "${process.env.DB_NAME}" não encontrado, criando-o...`);

      // Cria o banco de dados antes de tentar conectar com ele
      const createDbSequelize = new Sequelize({
        dialect: process.env.DB_DIALECT,
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        logging: false
      });

      // Cria o banco de dados
      await createDbSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
      console.log(`Banco de dados "${process.env.DB_NAME}" criado com sucesso.`);

      // Agora tenta se conectar novamente com o banco de dados correto
      await sequelize.authenticate();
      console.log('Conexão com o banco de dados estabelecida com sucesso.');

      // Sincroniza as tabelas
      await sequelize.sync({ force: false });
      console.log('Tabelas sincronizadas com sucesso.');
    } else {
      console.error('Erro ao conectar ao banco de dados:', err);
    }
  }
};

// Executa a função para garantir que o banco de dados e as tabelas sejam criados
createDB();

module.exports = sequelize;
