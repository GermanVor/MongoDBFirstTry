const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require('cookie-parser');
const Club = require('./models/ClubModel');
const Admin = require('./models/Admin');

mongoose.connect("mongodb://localhost:27017/dogExhibitiondb", { useNewUrlParser: true }, function(err){
    if(err) return console.log(err);
    Club.findOne({title : 'Pug Abbey' }, function(err, club){
        if(err) return console.log(err); 
        if(! club) {
            let PugAbbey = new Club({
                //_id: new mongoose.Types.ObjectId(),
                title: 'Pug Abbey',
                numbers: []
            });
            PugAbbey.save();
        }
    
    });
    Club.findOne({title: 'Corgi Abbey' }, function(err, club){
        if(err) return console.log(err); 
        if(! club) {
            let CorgiAbbey = new Club({
                //_id: new mongoose.Types.ObjectId(),
                title: 'Corgi Abbey',
                numbers: []
            });
            CorgiAbbey.save()
        }
    });
    Admin.findOne({}, function(err, admin){
        if(err) return console.log(err);
        if(!admin){
            let admin = new Admin({
                name : 'admin'
            });
            admin.setPassword('pass');
            admin.save()
        }
    });
    
});

const app = express();

var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var passport = require('passport');
var expressSession = require('express-session');

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
app.set('port', process.env.PORT || 3005);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});