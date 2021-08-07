'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('order_items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'orders',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.STRING,
        references: {
          model: 'products',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      qty: {
        type: Sequelize.INTEGER,
      },
      subtotal: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order_items');
  },
};
