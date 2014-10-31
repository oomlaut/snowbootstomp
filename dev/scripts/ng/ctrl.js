app.controller('ctrl', ['$scope', '$sce', 'svc', 'ga', 'Facebook', function ctrl ($scope, $sce, svc, ga, Facebook){

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
