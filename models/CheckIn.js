"use strict";

module.exports = function(sequelize, DataTypes) {
  var CheckIn = sequelize.define("CheckIn", {
    uid: DataTypes.STRING(20)
  }, {
    classMethods: {
      associate: function(models) {
        CheckIn.belongsTo(models.Location);
      }
    }
  });

  return CheckIn;
};
