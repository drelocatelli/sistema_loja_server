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

    const categories = await Category.findAll();
    const categoryIds = categories.map(category => category.id); // Get the category_id from each category
    const numberOfProducts = 100;
    const products = []

    for (let i = 0; i < numberOfProducts; i++) {
      // Randomly select a category_id
      const randomCategoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];

      // Generate a product with random data
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        category_id: randomCategoryId,
        price: parseFloat(faker.commerce.price()),
        quantity: faker.datatype.number({ min: 1, max: 100 }),
        is_published: faker.datatype.boolean(),
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    await queryInterface.bulkInsert('products', products, {});
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('products', null, {});
  }
};
