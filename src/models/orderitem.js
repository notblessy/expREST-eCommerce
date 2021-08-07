'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Product, { foreignKey: 'product_id' });
      this.belongsTo(models.Order, { foreignKey: 'order_id' });
    }
  }
  OrderItem.init(
    {
      order_id: DataTypes.INTEGER,
      product_id: DataTypes.STRING,
      name: DataTypes.STRING,
      price: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      subtotal: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'order_items',
    }
  );
  return OrderItem;
};
