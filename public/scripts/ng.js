var app = angular.module('SnowBootStomp', [])
;app.factory('svc', function($http){

    'use strict';

    function noCache(addr, seed, callback){
        if(arguments.length === 2) {
            seed = Math.ceil((Math.random() * 1000) * (Math.random() * 1000));
        }
        var now = new Date().now;
        var separator = (addr.indexOf('?') === -1 ) ? '?' : '&';
        return addr + '?nocache=' + now + '' + seed;
    }

	return {
        locations: function(){
            return $http({
                method: 'GET',
                url: noCache('/locations')
            });
        },
        users: function(){
            return $http({
                method: 'GET',
                url: noCache('/users')
            });
        },
        checkins: function(){
            return $http({
                method: 'GET',
                url: noCache('/checkins')
            });
        }
    };
});
;
app.controller('ctrl', function ctrl ($scope, $sce, svc){

    'use strict';

    $scope.locations = [];
    $scope.user = '';

    svc.locations().success(function(data){
        console.dir('locations: ', data);
        $scope.locations = data;

        // cross-reference locations with checkins
    });

    svc.users().success(function(data){
        console.dir('users: ', data);
        //
    });

    svc.checkins().success(function(data){
        console.dir('checkins: ', data);
        //
    });


    function queryOpenGraph(){}

    function updateCheckins(checkins){}

    function checkinHeartbeat(){
        //window.setInterval();
    }

});
