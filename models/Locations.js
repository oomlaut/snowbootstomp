"use strict";

module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define("Location", {
    name: DataTypes.STRING(31),
    street: DataTypes.STRING(127),
    city: DataTypes.STRING(63),
    state: DataTypes.STRING(3),
    zip: DataTypes.INTEGER,
    longitude: DataTypes.FLOAT,
    latitude: DataTypes.FLOAT,
    streetViewParams: DataTypes.STRING(63),
    details: DataTypes.TEXT,
    eventOrder: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Location.hasMany(models.CheckIn);
      }
    }
  });

  return Location;
};
