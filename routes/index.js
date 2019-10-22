var express = require('express');
var router = express.Router();
const User = require('../models/UserModel');
const Club = require('../models/ClubModel');
const jsonParser = require('express').json();

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

function DellUserFromClub( titleClub, user){
    Club.findOne({ title : titleClub }, function(err, club){
        if(err) return console.log(err); 
        if(club){
            club.numbers.splice( club.numbers.indexOf(user._id ), 1 );
            club.save();
            return club._id;
        }
    });
}

function AddUserToClub( titleClub, user ){
    Club.findOne({ title : titleClub }, function(err, club){
        if(err) return console.log(err); 
        if(club){
            club.numbers.push(user._id);
            club.save();
            return club._id;
        }
    });
}

module.exports = function(passport){
	router.get('/', function(req, res) {
		res.render('index');
	});

	router.post('/login', passport.authenticate('login', {
		successRedirect: '/AdminVersion',
		failureRedirect: '/',
		failureFlash : true  
	}));
	//страница гостя
	router.get('/next', function(req, res){
		res.render('Version');
	});
	//страница админа
	router.get('/AdminVersion', isAuthenticated, function(req, res){
		res.render('AdminVersion');
	});
	//получить весь список пользователей 
    router.get( '/api/users', function(req, res){
        User.find({}, function(err, users){
            if(err) return console.log(err);
            res.send(users)//посылаю весь объект 
        });
	});
	//добавить пользователя
	router.post('/api/users', isAuthenticated, jsonParser, function(req, res) {
        if(!req.body) return res.sendStatus(400);
        const user = new User({
            name: req.body.name,
            age: req.body.age,
            titleClub: req.body.club 
		});
		user.save(function(err){
			if(err) return console.log(err);
			AddUserToClub( req.body.club, user);
			user.save();
			res.send(user);
		});
	})
	//изменить пользователя 
	router.put( '/api/users', isAuthenticated, jsonParser, function(req, res){
		if(!req.body) return res.sendStatus(400);
		const newUser = {
			age: req.body.age,
			name: req.body.name,
		};
		User.findOneAndUpdate({_id: req.body.id}, newUser, {new: true}, function(err, user){
			if(err) return console.log(err); 
			if( user.titleClub !== req.body.club ){
				DellUserFromClub( user.titleClub, user );
				AddUserToClub( req.body.club, user);
				user.titleClub = req.body.club;
				user.save();
			}
			res.send(user);
		});
	});
	// удалить пользователя
	router.delete('/api/users/:id', isAuthenticated, function(req, res){ 
        User.findByIdAndDelete(req.params.id, function(err, user){
			if(err) return console.log(err);
            DellUserFromClub( user.titleClub, user );
            res.send(user);
        });
	});
	//получить пользователя по id 
	router.get( '/api/users/:id', function(req, res){
        User.findOne({_id: req.params.id}, function(err, user){
            if(err) return console.log(err);
            res.send(user);
        });
	});
	//раздогиниться 
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}





