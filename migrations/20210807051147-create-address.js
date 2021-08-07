'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('addresses', {
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
      name: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      province: {
        type: Sequelize.STRING(100),
      },
      regency: {
        type: Sequelize.STRING(100),
      },
      district: {
        type: Sequelize.STRING(100),
      },
      village: {
        type: Sequelize.STRING(100),
      },
      postal_code: {
        type: Sequelize.STRING(25),
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
      },
      latitude: {
        type: Sequelize.DECIMAL(11, 8),
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
    await queryInterface.dropTable('Addresses');
  },
};
