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

    const collaborators = Array.from({ length: 100 }).map(() => ({
      name: faker.name.firstName(),
      email: faker.internet.email(),
      role: 'Colaborador',
      rg: faker.number.int({ min: 50, max: 100 }).toString(),
      cpf: faker.number.int({ min: 50, max: 100 }).toString(),
      date_of_birth: faker.date.past(30, '1990-01-01'),
      marital_status: 'Solteiro',
      gender: 'Masculino',
      full_address: faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.state(),
      created_at: new Date(),
      updated_at: new Date()
    }));

    await queryInterface.bulkInsert('colaborators', collaborators, {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('colaborators', null, {});
  }
};
