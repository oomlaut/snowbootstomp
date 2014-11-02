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
