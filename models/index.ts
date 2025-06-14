import fs from 'fs';
import path from 'path';
import {Sequelize, DataTypes} from 'sequelize';
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

interface Db {
  sequelize?: Sequelize;
  Sequelize?: typeof Sequelize;
  [key: string]: any;
}

const db: Db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const modelFunc = require(path.join(__dirname, file));
    const model = modelFunc(sequelize, DataTypes);
    if(model) {
      db[model.name] = model;
    }
  });

// Executa as associações
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
console.log('Models carregados:', Object.keys(db));

module.exports = db;
