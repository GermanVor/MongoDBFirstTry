var LocalStrategy = require('passport-local').Strategy;
let Admin = require('../models/Admin');
var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport){

	passport.use('login', new LocalStrategy({
            passReqToCallback : true
        },
        function(req, username, password, done) { 
            // check in mongo if a user with username exists or not
            Admin.findOne({ name :  username }, 
                function(err, user) {
                    if (err)
                        return done(err);
                    if (!user){
                        console.log('User Not Found with username '+username);
                        return done(null, false, req.flash('message', 'User Not found.'));                 
                    }
                    if (!user.validatePassword(password)){
                        console.log('Invalid Password');
                        return done(null, false, req.flash('message', 'Invalid Password')); // redirect back to login page
                    }
                    return done(null, user);
                }
            );
            //добавить проверку для аутентификации пользователя, если потребуется 
        })
    );
}