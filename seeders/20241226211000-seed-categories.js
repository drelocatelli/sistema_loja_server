'use strict';
const {faker} = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    faker.locale = 'pt_BR';

    const fakeCategories = Array.from({length: 50}).map(() => ({
      name: faker.commerce.department(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    }))

    await queryInterface.bulkInsert('categories', fakeCategories, {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('categories', null, {});
  }
};
