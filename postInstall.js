var process = require('child_process');
var exec = require('child_process').exec;

if (process.env === undefined){
    var bower = exec('bower install', function(error, stdout, stderr){
        if(error !== null) {
            throw error
        };
        console.log("bower install: \n",stdout);
        console.log("bower errors: \n",stderr);
    });
} else {
    var env = process.env.NODE_ENV;

    if (env === 'production'){
        var bower = exec('./node_modules/bower/bin/bower install', function(error, stdout, stderr){
            if(error !== null) {
                throw error
            };
            console.log("bower install: \n", stdout);
            console.log("bower errors: \n", stderr);
        });
        return;
    }
    console.log('no environment for ', env);
    process.exit(1);
}
