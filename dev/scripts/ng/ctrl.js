app.controller('ctrl', ['$scope', '$sce', 'svc', 'ga', 'Facebook', function ctrl ($scope, $sce, svc, ga, Facebook){

    'use strict';

    ga.init();

    $scope.locations = [];
    $scope.user = '';

    svc.locations().success(function(data){
        // console.log('locations', data);
        $scope.locations = data;

        // cross-reference locations with checkins
    });

    svc.users().success(function(data){
        // console.log('users: ', data);
        //
    });

    svc.checkins().success(function(data){
        // console.log('checkins: ', data);
        //
    });

    Facebook.getLoginStatus(function(response){
        console.log(response);
        if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            // app, and response.authResponse supplies
            // the user's ID, a valid access token, a signed
            // request, and the time the access token
            // and signed request each expire
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            // login.innerHTML = "Connected to Facebook.";
        } else if (response.status === 'not_authorized') {
            // the user is logged in to Facebook,
            // but has not authenticated your app
            console.log("Logged in to Facebook.");
        } else {
            // the user isn't logged in to Facebook.
            var link = document.createElement("a");
            link.setAttribute("href", "https://www.facebook.com/dialog/oauth?client_id=" + app.id + "&redirect_uri=" + window.location.protocol + app.uri);
            link.setAttribute("rel", "external");
            link.className = "btn fb-btn btn-primary btn-larges";
            link.innerHTML = '<i class="fa fa-facebook-square"></i> Login with Facebook';
            login.className = login.className + " active";
            login.appendChild(link);
        }
    });

    function queryOpenGraph(){}

    function updateCheckins(checkins){}

    function checkinHeartbeat(){
        //window.setInterval();
    }

}]);
