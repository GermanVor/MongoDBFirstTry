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
	// получить все клубы 
	router.get( '/api/clubs', function(req, res){
		Club.find({}, function(err, users){
				if(err) return console.log(err);
				res.send(users)//посылаю весь объект 
		});
	});
	//добавить пользователя
	router.post('/api/users', isAuthenticated, jsonParser, function(req, res) {
		
		if(!req.body) return res.sendStatus(400);
		
		const user = new User({ ...req.body, ...{ parents: { ...req.body }} });

		user.save(function(err){
			if(err) return console.log(err);
			AddUserToClub( req.body.club, user);
			
			res.send(user);
		});
	})
	
	//изменить пользователя 
	router.put( '/api/users', isAuthenticated, jsonParser, function(req, res){
		if(!req.body) return res.sendStatus(400);

		User.findOne({_id: req.body.id}, function(err, user){
			if(err) return console.log(err);
			if( user.club !== req.body.club ){
				DellUserFromClub( user.club, user );
				AddUserToClub( req.body.club, user);
			}
		})
		User.findOneAndUpdate({_id: req.body.id}, { ...req.body, ...{ parents: { ...req.body }} }, {new: true}, function(err, user){
			if(err) return console.log(err); 
			res.send(user);
		});
	});
	// удалить пользователя
	router.delete('/api/users/:id', isAuthenticated, function(req, res){ 
        User.findByIdAndDelete(req.params.id, function(err, user){
						if(err) return console.log(err);
            DellUserFromClub( user.club, user );
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
	//получить пользователя по имени
	router.get( '/api/users/name/:name', function(req, res){
		User.findOne({ name: req.params.name}, function(err, user){
				if(err) return console.log(err);
				res.send(user);
		});
	});
	//изменить клуб
	router.put( '/api/clubs/:id', isAuthenticated, jsonParser, function(req, res) {
			if(!req.body) return res.sendStatus(400);
			let Info = {
				experts: req.body.experts.filter( a => a!==''),
				medals: req.body.medals.filter( a => a!=='')
			};
			
			Club.findOneAndUpdate({_id: req.params.id}, Info, {new: true}, function(err, user) {
				if(err) return console.log(err);
			});
	});
	//добавить информацию клуба 
	router.put( '/api/clubs/info/:id', isAuthenticated, jsonParser, function(req, res){
		if(!req.body) return res.sendStatus(400);
		Club.findById(req.params.id, function(err, club){
			if(err) return console.log(err);
			if(req.body.data && req.body.key in club) {
				club[req.body.key] = [ ...club[req.body.key], req.body.data];
				club.save();
			}
		})
	});
	//разлогиниться 
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}





