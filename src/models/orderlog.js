'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderLog.init(
    {
      actor: DataTypes.ENUM('ADMIN', 'CUSTOMER'),
      status: DataTypes.TEXT,
      order_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderLog',
      tableName: 'order_logs',
    }
  );
  return OrderLog;
};
