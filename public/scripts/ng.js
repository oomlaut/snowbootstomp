var app = angular.module('SnowBootStomp', ['facebook']);

app.constant('ga_tracking_id', 'UA-1575455-12');
app.constant('fb_app_id', '748687018544609');

// https://github.com/Ciul/angular-facebook
app.config(['FacebookProvider', 'fb_app_id', function(FacebookProvider, fb_app_id){
    FacebookProvider.init({
        appId      : fb_app_id, // App ID
        channelUrl : "//" + window.location.hostname + '/channel.html', // Channel File
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true, // parse XFBML
        version    : 'v2.1'
    });
}]);
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
;app.controller('ctrl', ['$scope', '$sce', 'svc', 'ga', 'Facebook', function ctrl ($scope, $sce, svc, ga, Facebook){

    'use strict';

    // Initialize Google Analytics
    ga.init();

    $scope.locations = [];
    var user = {};

    var getLocations = svc.locations;

    function updateCheckins(checkins){}

    function checkinHeartbeat(){
        //window.setInterval();
    }



    svc.users().success(function(data){
        // console.log('users: ', data);
        //
    });

    svc.checkins().success(function(data){
        // console.log('checkins: ', data);
        //
    });

    $scope.$watch(function(){
        return Facebook.isReady();
    }, function(isReady){
        if(isReady){
            $scope.facebookReady = true;
            getLocations().success(function(data){
                $scope.locations = data;
            });
            //perform location loads
        }
    });

    Facebook.getLoginStatus(function(response){
        console.log("Facebook Login Status: ", response);
        if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token
            // and signed request each expire
            console.log("Logged in, connected.");
            angular.extend(user, {
                uid: response.authResponse.userID,
                accessToken: response.authResponse.accessToken,
                status: response.status
            });

        // } else if (response.status === 'not_authorized') {
        //     // the user is logged in to Facebook,
        //     // but has not authenticated your app
        //     console.log("Logged in, not connected.");
        //     angular.extend(user, {
        //         status: response.status
        //     });
        } else {
            // the user isn't logged in to Facebook.
            console.log("Not connected.");
            angular.extend(user, {
                status: response.status
            });
        }
    });


    $scope.IntentLogin = function(){
        if(user.status) {
            $scope.login();
        }
    };

    $scope.login = function() {
        Facebook.login(function(response) {
            if (response.status == 'connected') {
                $scope.logged = true;
                $scope.me();
            }

        });
    };

    $scope.me = function() {
        Facebook.api('/me', function(response) {
            /**
            * Using $scope.$apply since this happens outside angular framework.
            */
            $scope.$apply(function() {
                $scope.user.response = response;
            });

        });
    };
}]);
