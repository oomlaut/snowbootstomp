"use strict";

var fs        = require("fs");
var path      = require("path");

var config = {};

// console.log("process: ",process.env);
if(process.env !== undefined && process.env.NODE_ENV === "production"){
    config = {
        "database": process.env.DB_NAME,
        "username": process.env.DB_USER,
        "password": process.env.DB_PASS,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_DIALECT
    }
} else {
    config = require('./../env.json')["development"];
}

var Sequelize = require("sequelize");
var sequelize = new Sequelize(config.database, config.username, config.password, config);

var db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
