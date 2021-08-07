const { Model } = require('sequelize');

const User = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Order, { foreignKey: 'user_id' });
      this.hasMany(models.Address, { foreignKey: 'user_id' });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.ENUM('ADMIN', 'CUSTOMER'),
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};

module.exports = User;
