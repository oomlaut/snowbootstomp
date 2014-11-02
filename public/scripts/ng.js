var app = angular.module('SnowBootStomp', ['facebook']);

app.constant('ga_tracking_id', 'UA-1575455-12');
app.constant('fb_app_id', '748687018544609');

// https://github.com/Ciul/angular-facebook
app.config(['FacebookProvider', 'fb_app_id', function(FacebookProvider, fb_app_id){
    FacebookProvider.init({
        appId      : fb_app_id, // App ID
        // channelUrl : "//" + window.location.hostname + '/channel.html', // Channel File
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
        getLocations: function(){
            return $http({
                'method': 'GET',
                'url': noCache('/locations')
            });
        },
        // getUsers: function(){
        //     return $http({
        //         method: 'GET',
        //         url: noCache('/users')
        //     });
        // },
        getCheckins: function(){
            return $http({
                'method': 'GET',
                'url': noCache('/checkins')
            });
        },
        postCheckin: function(data){
            return $http({
                'method': 'POST',
                'url': noCache('/data/store/'),
                'data': data,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'responseType': 'string'
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

    $scope.locations = {
        list: {},
        getLocations: function(){
            var context = this;
            svc.getLocations().success(function(data){
                angular.extend(context.list, data);
            });
            return this;
        },
        // getLocation: function(id){
        //     if(arguments.length === 0){
        //        throw "$scope.locations.getLocation requires argument `id`.";
        //     }
        //     svc.getLocation(id).success(function(data){});
        // },
        mergeCheckins: function(checkins){
            //
            console.log(data);
            for (var checkin in checkins){

            }
        }
    };

    $scope.user = {
        connected: null
    };

    $scope.users = {
        list: {},
        // getUsers: function(){
        //     var context = this;
        //     svc.getUsers().success(function(data){
        //         for(var i in data){
        //             context.check(data[i].fb_id);
        //         }
        //     });
        // },
        // getUser: function(uid){
        //     //if(arguments.length === 0){
        //     //    throw "$scope.user.getUser requires argument `uid`.";
        //     //}
        //     //svc.getUser(uid).success(function(data){});
        //     return this;
        // },
        connect: function(response){
            if(arguments.length === 0){
                throw "$scope.users.connect requires argument `uid`.";
            }
            var context = this;
            //console.log("Facebook Login Status: ", response);
            if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token
                // and signed request each expire

                angular.extend($scope.user, {
                    connected: true,
                    uid: response.authResponse.userID,
                    accessToken: response.authResponse.accessToken,
                    signedRequest: response.authResponse.signedRequest,
                    status: response.status
                });

                // $scope.$apply(function() {
                //     user.data = data;
                // });

                context.check($scope.user.uid);

                $scope.checkins.getCheckins(true);

            // } else if (response.status === 'not_authorized') {
            //     // the user is logged in to Facebook,
            //     // but has not authenticated your app
            //     console.log("Logged in, not connected.");
            //     angular.extend(user, {
            //         status: response.status
            //     });
            } else {
                // the user isn't logged in to Facebook.
                $scope.user.connected = false;
            }

            return this;
        },
        check: function(uid){
            if(arguments.length === 0){
                throw "$scope.users.check requires argument `uid`.";
            }
            var context = this;
            if(!(uid in this.list)){
                context.addUser(uid);
                return false;
            }
            return true;
        },
        addUser: function(uid){
            if(arguments.length === 0){
                throw "$scope.users.addUser requires argument `uid`.";
            }
            var context = this;
            Facebook.api('/' + uid, function(response){
                context.list[uid] = response;
                context.addUserPicture(uid);
            });
            return this;
        },
        addUserPicture: function(uid){
            if(arguments.length === 0){
                throw "$scope.users.add requires argument `uid`.";
            }
            var context = this;
            Facebook.api('/' + uid + '/picture', function(response){
               context.list[uid].picture = response.data;
            });
            return this;
        }
    }

    /**
     * Checkins are private, unexposed to the view-model
     */

    $scope.checkins = {
        processing: false,
        pollInterval: null,
        pollDelay: 2000,
        pollInc: 0,
        pollStart: function(){
            var context = this;
            context.pollInterval = window.setInterval(function(){
                if(!context.processing){ //something is taking too long, skip it this time.
                    context.processing = true;
                    context.getCheckins();
                }
            }, context.pollDelay);
        },
        pollStop: function(){
            this.processing = false;
            window.clearInterval(this.pollInterval);
        },
        getCheckins: function(startInterval){
            var context = this;
            //console.log('polling: ', context.pollInc++);
            svc.getCheckins().success(function(data){
                // parse data
                $scope.locations.mergeCheckins(data);

                if(arguments.length !== 0 && startInterval) {
                    context.pollStart();
                }
                context.processing = false;
            });
            return this;
        }
    };

    /**
     * Facebook Login Methods/Events
     */

    $scope.$watch(function(){
        return Facebook.isReady();
    }, function(isReady){
        if(isReady){
            $scope.facebookReady = true;
            $scope.locations.getLocations();
        }
    });

    Facebook.getLoginStatus(function(response){
        $scope.users.connect(response);
    });

    $scope.IntentLogin = function(){
        if($scope.user.status !== true) {
            Facebook.login(function(response) {
                $scope.users.connect(response);
            });
        }
    };

    /** #end Facebook Login Methods/Events **/



    /**
     * Event CheckIn Methods
     */

    $scope.hasCheckedIn = function(location_id){
        //$scope.locations.list[location_id].checkins.indexOf($scope.user.uid) > -1
        return false; //($scope.user.uid in $scope.locations.list[location_id].checkins);
    };

    $scope.checkin = function(location_id){
        if(arguments.length === 0){
            throw "$scope.checkin requires argument `location_id`";
        }
        $scope.checkins.pollStop();
        svc.postCheckin({
            'uid': $scope.user.uid,
            'location_id':
        }).success(function(){})
        return false;
    };

    /** #end CheckIn Methods **/

}]);
