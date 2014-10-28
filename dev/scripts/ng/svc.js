app.factory('svc', function($http){

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
