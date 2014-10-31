"use strict";

var models = require("./models");

var express = require('express');
var app = express();
var router = express.Router();

models.sequelize.sync().success(function () {
    app.set('port', (process.env.PORT || 5000));

    app.use(express.static(__dirname + '/public'));

    var server = app.listen(app.get('port'), function() {
      console.log("Node app is running at localhost:" + server.address().port);
    });

    app.get('/', function(request, response) {
      response.render('index.html');
    });

    /* Facebook Apps */
    app.get('/terms-of-service', function(request, response){
        response.render('./public/terms-of-service.html');
    });

    app.get('/privacy', function(request, response){
        response.render('./public/privacy.html');
    });

    app.get('/support', function(request, response){
        response.render('./public/support.html');
    });

    /* Data Routes */

    app.get('/locations', function(request, response){
        models.Location.findAll({order: 'eventOrder ASC'}).success(function(locations){
            response.type('application/json');
            response.send(locations);
        });
    });

    app.get('/users', function(request, response){
        models.User.findAll().success(function(users){
            response.type('application/json');
            response.send(users);
        });
    });

    app.get('/checkins', function(request, response){
        models.CheckIn.findAll().success(function(checkins){
            response.type('application/json');
            response.send(checkins);
        });
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
});
