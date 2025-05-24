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
    await queryInterface.createTable('comments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      commentableId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'commentable_id'
      },
      commentableType: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'commentable_type'
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'author_id'
      },
      authorType: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'author_type'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('comments');
  }
};
