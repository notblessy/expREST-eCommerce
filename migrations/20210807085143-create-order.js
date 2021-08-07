'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.STRING,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: false,
        onDelete: 'CASCADE',
      },
      invoice_no: {
        type: Sequelize.STRING,
      },
      customer_name: {
        type: Sequelize.STRING,
      },
      customer_phone: {
        type: Sequelize.STRING,
      },
      customer_address: {
        type: Sequelize.STRING,
      },
      courier: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM(
          'WAITING_PAYMENT',
          'PAYMENT_RECEIVED',
          'PREPARING',
          'READY',
          'DELIVERING',
          'DELIVERED',
          'DONE',
          'CANCELLED',
          'REJECTED'
        ),
      },
      total: {
        type: Sequelize.INTEGER,
      },
      paid_at: {
        allowNull: true,
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('orders');
  },
};
