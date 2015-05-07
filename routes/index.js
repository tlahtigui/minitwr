var express = require('express');
var router = express.Router();
var mongo = require('mongodb'),
	assert = require('assert');
var MongoClient = mongo.MongoClient;

var url = 'mongodb://localhost:27017/waiss';
var wdb = null;
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  wdb = db;
  console.log("Connected correctly to server");
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Mini Tweeter' });
});

router.post('/login', function(req, res) {
	console.log(req.body.login);
	console.log(req.body.password);

	wdb.collection('users').find({
		login:req.body.login, 
		password:req.body.password
	}).toArray(function(err, user) {
		if (err != null) {
			console.log("Erreur pendant la requete sur l'utilisateur!");
			console.log(err);
			return;
		} else if (user.length != 1) {
			console.log("l'utilisateur n'a pas été trouvé !");
			res.render('new_user');
		} else {
			console.log("l'utilisateur a été trouvé !");
			res.render('home', {login:req.body.login, login_id:user[0]._id});
		}
		
	});


});

router.post('/create', function(req, res) {
	console.log(req.body.login);
	console.log(req.body.password);

	wdb.collection('users').find({login:req.body.login, password:req.body.password}).toArray(function(err, user) {
		if (err != null) {
			console.log("Erreur pendant la requete sur l'utilisateur!");
			console.log(err);
			return;
		} else if (user.length != 1) {
			console.log("l'utilisateur n'a pas été trouvé !");
			var user = {_id: mongo.ObjectID.createPk(), login:req.body.login, password:req.body.password};
			wdb.collection('users').insert([user], function(err, result) {
				if (err != null)
					console.log(err);
				console.log("L'utilisateur a été ajouté en BDD !")
				res.render('home', {login:req.body.login, login_id:user._id});
			});
		} else {
			console.log("l'utilisateur a été trouvé !");
			res.render('home', {login:req.body.login, login_id:user[0]._id});
		}
		
	});
});

router.post('/postmessage', function(req, res) {
	console.log(req.body.message);
	console.log(req.body.login_id);
	var user_id = req.body.login_id;
	var message = req.body.message;

	wdb.collection('users_message').insert([{user_id:user_id, message:message}], function(err, result) {
		if (err != null)
			console.log(err);
		console.log("Le message a été ajouté en BDD !")
		
	});
});

router.get('/getmessage', function(req, res) {
	console.log(req.query.login_id);
	var user_id = req.query.login_id;

	wdb.collection('users_message').find({user_id:user_id}).toArray(function(err, messages) {
		if (err != null){
			console.log("Erreur pendant la requete sur les messages de l'utilisateur!");
			console.log(err);
			return;
		}
		res.json(messages);
		
	});
});

module.exports = router;
