"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    fb_id: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.CheckIn);
      }
    }
  });

  return User;
};
