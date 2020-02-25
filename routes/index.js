var express = require('express');
var router = express.Router();
const jsonParser = require('express').json();

const {UserController} = require('./controller/UserController');
const {ClubController} = require('./controller/ClubController');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
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

	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	//страница гостя
	router.get('/next', function(req, res){
		res.render('Version');
	});
	//страница админа
	router.get('/AdminVersion', isAuthenticated, function(req, res){
		res.render('AdminVersion');
	});

	//получить весь список пользователей 
	router.get( '/api/users', UserController.getAll);

	//добавить пользователя
	router.post('/api/users', isAuthenticated, jsonParser, UserController.add)

	//изменить пользователя 
	router.put( '/api/users', isAuthenticated, jsonParser, UserController.update)

	// удалить пользователя
	router.delete('/api/users/:id', isAuthenticated, UserController.remove)

	//получить пользователя по id 
	router.get( '/api/users/:id', UserController.get);

	//получить пользователя по имени
	router.get( '/api/users/name/:name', UserController.getByName);

	// получить все клубы 
	router.get( '/api/clubs',	ClubController.getAll);

	//изменить клуб
	router.put( '/api/clubs/:id', isAuthenticated, jsonParser, ClubController.update)

	//добавить информацию клуба 
	router.put( '/api/clubs/info/:id', isAuthenticated, jsonParser, ClubController.addInfo);

	return router;
}





