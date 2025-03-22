'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('login', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM('colaborator', 'manager', 'admin'),
        defaultValue: 'colaborator'
      },
      colaborator_id: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'colaborators',
          key: 'id'
        },
        onDelete: 'CASCADE',
      }
    });
  },

  async down (queryInterface, Sequelize) {

    await queryInterface.dropTable('login');
  }
};
