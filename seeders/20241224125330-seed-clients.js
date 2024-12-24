const {faker} = require('@faker-js/faker');
'use strict';

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

    const fakeClients = Array.from({length: 50}).map(() => ({
      name: faker.name.fullName(),
      email: faker.internet.email(),
      rg: faker.helpers.replaceSymbols('##.###.###-#'),
      cpf: faker.helpers.replaceSymbols('###.###.###-##'),
      phone: faker.phone.number('(##) #####-####'),
      address: faker.address.streetAddress(),
      cep: faker.address.zipCode(),
      city: faker.address.city(),
      state: faker.address.state(),
      country: faker.address.country(),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    }))

    await queryInterface.bulkInsert('clients', fakeClients, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('clients', null, {});
  }
};
