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
        if(arguments.length < 2 || seed == null) {
            seed = Math.ceil((Math.random() * 1000) * (Math.random() * 1000));
        }
        var now = Date.now();
        var separator = (addr.indexOf('?') === -1 ) ? '?' : '&';
        return addr + separator + 'nocache=' + now + '' + seed;
    }

	return {
        getLocations: function(){
            return $http({
                'method': 'GET',
                'url': noCache('/locations')
            });
        },
        getCheckins: function(){
            return $http({
                'method': 'GET',
                'url': noCache('/checkins')
            });
        },
        postCheckin: function(data){
            return $http({
                'method': 'POST',
                'url': noCache('/checkin'),
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

    $scope.locationlist = [];
    $scope.userlist = {};

    $scope.user = {
        connected: null // represents a nullable type. take that.
    };

    function getPosition(arr, key, value){
        for(var i in arr){
            if(arr[i][key] === value){
                return i;
            }
        }

        return -1;
    }

    function getLocations(){
        svc.getLocations().success(function(data){
            angular.extend($scope.locationlist, data);
        });
    }

    function mergeCheckins(data){
        for (var i in data){
            var location_id = data[i]['LocationId'];
            var uid = data[i]['uid'];
            var position = getPosition($scope.locationlist, 'id', location_id);
            if(position > -1){
                if(typeof $scope.locationlist[position].checkins === 'undefined'){
                    $scope.locationlist[position].checkins = [];
                }
                if($scope.locationlist[position].checkins.indexOf(uid) === -1){
                    $scope.locationlist[position].checkins.push(uid);
                }
            } else {
                throw "No location available at position " + location_id;
            }
        }
    }

    var users = {
        connect: function(response){
            if(arguments.length === 0){
                throw "users.connect requires argument `response`.";
            }
            var context = this;
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

                context.check($scope.user.uid);

                checkins.getCheckins(true);

            } else {
                // the user isn't logged in to Facebook.
                $scope.user.connected = false;
            }

            return this;
        },
        check: function(uid){
            if(arguments.length === 0){
                throw "users.check requires argument `uid`.";
            }
            var context = this;
            if(!(uid in $scope.userlist)){
                context.addUser(uid);
                return false;
            }

            return true;
        },
        addUser: function(uid){
            if(arguments.length === 0){
                throw "users.addUser requires argument `uid`.";
            }
            var context = this;
            Facebook.api('/' + uid, function(response){
                $scope.userlist[uid] = response;
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
                $scope.$apply(function(){
                    $scope.userlist[uid].picture = response.data;
                });
            });

            return this;
        }
    };

    /**
     * Checkins are private, unexposed to the view-model
     */

    var checkins = {
        processing: false,
        pollInterval: null,
        pollDelay: 2000,
        pollInc: 0,
        pollStart: function(){
            var context = this;
            // TODO: research https://docs.angularjs.org/api/ng/service/$interval
            context.pollInterval = window.setInterval(function(){
                $scope.$apply(function(){
                    if(!context.processing){ //something is taking too long, skip it this time.
                        context.processing = true;
                        context.getCheckins();
                    }
                });
            }, context.pollDelay);
        },
        pollStop: function(){
            // console.log('stopping polling...');
            this.processing = false;
            window.clearInterval(this.pollInterval);
        },
        getCheckins: function(startInterval){
            if(arguments.length === 0){
                startInterval = false;
            }
            var context = this;
            // console.log('polling: ', context.pollInc++);
            svc.getCheckins().success(function(data){
                // parse data
                mergeCheckins(data);
                if(startInterval) {
                    context.pollStart();
                }
                context.processing = false;
            });
            return this;
        }
    };

    //temporarily expose the checkin object to the global scope
    window.checkins = checkins;

    /**
     * Facebook Login Methods/Events
     */

    $scope.$watch(function(){
        return Facebook.isReady();
    }, function(isReady){
        if(isReady){
            $scope.facebookReady = true;
            getLocations();
        }
    });

    Facebook.getLoginStatus(function(response){
        users.connect(response);
    });

    $scope.IntentLogin = function(){
        if($scope.user.status !== true) {
            Facebook.login(function(response) {
                users.connect(response);
            });
        }
    };

    /** #end Facebook Login Methods/Events **/



    /**
     * Event CheckIn Methods
     */
    $scope.isProcessing = function(){
        return checkins.processing;
    };

    $scope.hasCheckedIn = function(location){
        if(typeof location.checkins === 'undefined') {
            return false;
        }
        // use `* 1` to turn a string into a number for comparison
        return (location.checkins.indexOf($scope.user.uid*1) > -1);
    };

    $scope.checkin = function(location_id){
        if(arguments.length === 0){
            throw "$scope.checkin requires argument `location_id`";
        }
        checkins.pollStop();
        svc.postCheckin({
            'uid': $scope.user.uid,
            'LocationId': location_id
        }).success(function(response){
            checkins.getCheckins(true);
        });

        return false;
    };

    /** #end CheckIn Methods **/

}]);
