"use strict";
const { Model } = require("sequelize");
const identitas = require("./identitas");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasOne(models.identitas, {
        as: 'identitas',
        foreignKey: 'userId'
     })
    }
  }
  user.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.ENUM("active", "nonActive"),
      jenisKelamin: DataTypes.ENUM("laki-laki", "perempuan"),
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
