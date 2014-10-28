
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
