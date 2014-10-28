var exec = require('child_process').exec;

if (process.env.NODE_ENV === undefined){
    console.log('development postinstall');
    var bower = exec('bower install', function(error, stdout, stderr){
        if(error !== null) {
            throw error
        };
        console.log("bower install: \n",stdout);
        console.log("bower errors: \n",stderr);
    });
} else {
    console.log("Skipping bower install for production due to SASS 3.4.6 bug.");
    // var env = process.env.NODE_ENV;

    // if (env === 'production'){
    //     var bower = exec('./node_modules/bower/bin/bower install', function(error, stdout, stderr){
    //         if(error !== null) {
    //             throw error
    //         };
    //         console.log("bower install: \n", stdout);
    //         console.log("bower errors: \n", stderr);
    //     });
    //     return;
    // }
    // console.log('no environment for ', env);
    // process.exit(1);
}
