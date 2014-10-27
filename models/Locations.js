"use strict";

module.exports = function(sequelize, DataTypes) {
  var Location = sequelize.define("Location", {
    name: DataTypes.STRING,
    street: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.INTEGER,
    longitude: DataTypes.FLOAT,
    latitude: DataTypes.FLOAT,
    streetViewParams: DataTypes.STRING,
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
