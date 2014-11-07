app.controller('ctrl', ['$scope', '$interval', 'svc', 'ga', 'Facebook', function ctrl ($scope, $interval, svc, ga, Facebook){

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
                if($scope.locationlist[position].checkins.indexOf(uid.toString()) === -1){
                    $scope.locationlist[position].checkins.push(uid.toString());
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
                $scope.userlist[uid.toString()] = response;
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
                    $scope.userlist[uid.toString()].picture = response.data;
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
            context.pollInterval = $interval(function(){
                if(!context.processing){ //something is taking too long, skip it this time.
                    context.processing = true;
                    context.getCheckins();
                }
            }, context.pollDelay);
        },
        pollStop: function(){
            // console.log('stopping polling...');
            var context = this;
            $interval.cancel(context.pollInterval);
            context.pollInterval = null;
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

    $scope.hasCheckedIn = function(location){
        if(typeof location.checkins === 'undefined') {
            return false;
        }

        return (location.checkins.indexOf($scope.user.uid) > -1);
    };

    $scope.checkin = function(location_id){
        if(arguments.length === 0){
            throw "$scope.checkin requires argument `location_id`";
        }
        if (!checkins.processing){
            checkins.pollStop();
            svc.postCheckin({
                'uid': $scope.user.uid,
                'LocationId': location_id
            }).success(function(response){
                checkins.getCheckins(true);
            });
        }

        return false;
    };

    /** #end CheckIn Methods **/

}]);
