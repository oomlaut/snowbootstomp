"use strict";

var models = require("./models");

var express = require('express');
var app = express();
// var router = express.Router();

models.sequelize.sync().success(function () {
    app.set('port', (process.env.PORT || 5000));

    app.use(express.static(__dirname + '/public'));

    var server = app.listen(app.get('port'), function() {
      console.log("Node app is running at localhost:" + server.address().port);
    });

    app.get('/', function(request, response) {
      response.render('index.html');
    });


    /* Data Routes */

    app.get('/locations', function(request, response){
        models.Location.findAll({order: 'eventOrder ASC'}).success(function(locations){
            response.type('application/json');
            response.send(locations);
        });
    });

    app.get('/location', function(request, response){
        models.Location.find({'where': { id: request.query.id }}).success(function(location){
            response.type('application/json');
            response.send(location);
        });
    });

    app.get('/checkins', function(request, response){
        models.CheckIn.findAll().success(function(checkins){
            response.type('application/json');
            response.send(checkins);
        });
    });

    app.post('/checkin', function(request, response){
        console.log(request.body);
        request.accepts('application/json');
        var checkin = CheckIn.build({
            uid: request.body.uid,
            LocationId: request.body.location_id
        });
        checkin.save().complete(function(err){
            if(err){
                console.log(err);
            }
        });
    });

    app.get('/reset', function(request, response){
        //
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
});
