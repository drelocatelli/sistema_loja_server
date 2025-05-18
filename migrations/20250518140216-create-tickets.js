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
    await queryInterface.createTable('tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      colaboratorId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'colaborators',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      category: {
        allowNull: false,
        type: Sequelize.ENUM('conta', 'pagamento', 'entrega', 'produto', 'outros'),
      },
      priority: {
        allowNull: false,
        type: Sequelize.ENUM('baixa', 'media', 'alta')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('tickets');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Tickets_categoria";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Tickets_prioridade";');
  }
};
