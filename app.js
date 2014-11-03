"use strict";

var models = require("./models");

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
app.use(bodyParser.json());
// var router = express.Router();

models.sequelize.sync().success(function () {
    app.set('port', (process.env.PORT || 5000));

    app.use(express.static(__dirname + '/public'));

    var server = app.listen(app.get('port'), function() {
      console.log("Node app is running at localhost:" + server.address().port);
    });

    function showHome(response){
    }

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
        request.accepts('application/json');

        // TODO: first check the database to see if the user already has a checkin at this location. Deny.
        var checkin = models.CheckIn.build({
            'uid': request.body.uid,
            'LocationId': request.body.LocationId
        });
        checkin.save().success(function(msg){
            response.type('text/plain');
            response.send(msg);
        });
    });

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
});
