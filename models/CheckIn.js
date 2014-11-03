"use strict";

module.exports = function(sequelize, DataTypes) {
  var CheckIn = sequelize.define("CheckIn", {
    uid: DataTypes.BIGINT
  }, {
    classMethods: {
      associate: function(models) {
        CheckIn.belongsTo(models.Location);
      }
    }
  });

  return CheckIn;
};
