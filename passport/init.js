var login = require('./login');
let Admin = require('../models/Admin')

module.exports = function(passport){
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        Admin.findById(id, function(err, user) {
            done(err, user);
        });
    });
    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
}