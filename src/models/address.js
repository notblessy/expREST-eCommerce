'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User);
    }
  }

  Address.init(
    {
      user_id: DataTypes.STRING,
      name: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.TEXT,
      province: DataTypes.STRING,
      regency: DataTypes.STRING,
      district: DataTypes.STRING,
      village: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      longitude: DataTypes.DECIMAL,
      latitude: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: 'Address',
    }
  );
  return Address;
};
