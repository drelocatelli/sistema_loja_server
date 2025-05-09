'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn('customers', 'password', {
      type: Sequelize.STRING(60),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('customers', 'password', {
      type: Sequelize.STRING(45), // Tamanho anterior (ou qualquer tamanho que queira)
      allowNull: false, // (se necessário)
    });
  }
};
