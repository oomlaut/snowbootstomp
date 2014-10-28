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

app.factory('ga', ['ga_tracking_id', function(ga_tracking_id){
    var context = this;

    return {
        initialized: false,
        tracking_id: null,
        init: function(){
            // Google Analytics
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

            ga('create', ga_tracking_id, 'auto');
            ga('send', 'pageview');

            this.initialized = true;
            this.tracking_id = ga_tracking_id;

            return this;
        }
    };
}]);
