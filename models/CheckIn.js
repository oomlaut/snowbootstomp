"use strict";

module.exports = function(sequelize, DataTypes) {
  var CheckIn = sequelize.define("CheckIn", null, {
    classMethods: {
      associate: function(models) {
        CheckIn.belongsTo(models.Location);
        CheckIn.belongsTo(models.User);
      }
    }
  });

  return CheckIn;
};
