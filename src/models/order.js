'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id' });
      this.hasMany(models.OrderItem, { foreignKey: 'order_id' });
    }
  }
  Order.init(
    {
      user_id: DataTypes.STRING,
      invoice_no: DataTypes.STRING,
      customer_name: DataTypes.STRING,
      customer_phone: DataTypes.STRING,
      customer_address: DataTypes.STRING,
      courier: DataTypes.STRING,
      status: DataTypes.ENUM(
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
      total: DataTypes.INTEGER,
      paid_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Order',
    }
  );
  return Order;
};
