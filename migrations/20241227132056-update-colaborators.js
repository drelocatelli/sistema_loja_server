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

    await queryInterface.addColumn('colaborators', 'date_of_birth', {
      allowNull: false,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('colaborators', 'cpf', {
      allowNull: false,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('colaborators', 'marital_status', {
      allowNull: false,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('colaborators', 'gender', {
      allowNull: false,
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn('colaborators', 'full_address', {
      allowNull: false,
      type: Sequelize.STRING,
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('colaborators', 'date_of_birth');
    await queryInterface.removeColumn('colaborators', 'cpf');
    await queryInterface.removeColumn('colaborators', 'marital_status');
    await queryInterface.removeColumn('colaborators', 'gender');
    await queryInterface.removeColumn('colaborators', 'full_address');
  }
};
