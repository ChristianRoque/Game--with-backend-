const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const LeaderBoard = require('../models/LeaderBoard');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

router.post('/signup', (req, res, next) => {
	const { username, password, initials } = req.body;
	let highScore = 0;
	if (!username || !password) {
		res.status(400).json({ message: 'Indicate username and password' });
		return;
	}
	User.findOne({ username })
		.then((userDoc) => {
			if (userDoc !== null) {
				res.status(409).json({ message: 'The username already exists' });
				return;
			}
			const salt = bcrypt.genSaltSync(bcryptSalt);
			const hashPass = bcrypt.hashSync(password, salt);
			const newUser = new User({ username, password: hashPass, highScore: highScore, initials: initials });
			return newUser.save();
		})
		.then((userSaved) => {
			LeaderBoard.findByIdAndUpdate('5dacfd59e5417c523a0c9518', {
				$push: { userScores: userSaved._id }
			}).then((board) => {
				console.log(board);
			});

			req.logIn(userSaved, () => {
				userSaved.password = undefined;
				res.json(userSaved);
			});
		})
		.catch((err) => next(err));
});

// {
// 	"username": "christian",
// 	"password": "christian",
// 	"initials": "CHRIS"
// }

router.post('/login', (req, res, next) => {
	const { username, password } = req.body;

	// first check to see if there's a document with that username
	User.findOne({ username })
		.then((userDoc) => {
			// "userDoc" will be empty if the username is wrong (no document in database)
			if (!userDoc) {
				// create an error object to send to our error handler with "next()"
				next(new Error('Incorrect username '));
				return;
			}

			// second check the password
			// "compareSync()" will return false if the "password" is wrong
			if (!bcrypt.compareSync(password, userDoc.password)) {
				// create an error object to send to our error handler with "next()"
				next(new Error('Password is wrong'));
				return;
			}

			// LOG IN THIS USER
			// "req.logIn()" is a Passport method that calls "serializeUser()"
			// (that saves the USER ID in the session)
			req.logIn(userDoc, () => {
				// hide "encryptedPassword" before sending the JSON (it's a security risk)
				userDoc.password = undefined;
				res.json(userDoc);
			});
		})
		.catch((err) => next(err));
});

// {
// 	"username": "christian",
// 	"password": "christian"
// }

router.post('/login-with-passport-local-strategy', (req, res, next) => {
	passport.authenticate('local', (err, theUser, failureDetails) => {
		if (err) {
			res.status(500).json({ message: 'Something went wrong' });
			return;
		}

		if (!theUser) {
			res.status(401).json(failureDetails);
			return;
		}

		req.login(theUser, (err) => {
			if (err) {
				res.status(500).json({ message: 'Something went wrong' });
				return;
			}

			// We are now logged in (notice req.user)
			res.json(req.user);
		});
	})(req, res, next);
});

router.get('/current', (req, res, next) => {
	let username = req.user;
	res.json(username);
});

router.post('/updateScore', (req, res, next) => {
	const { userID, score } = req.body;
	User.findByIdAndUpdate(userID, { highScore: score }).then(res.json('You did it!'));
});

router.post('/createBoard', (req, res, next) => {
	let myPassword = 'HelloWorld';
	const { password } = req.body;
	if (password == myPassword) {
		LeaderBoard.create({}).then(res.json('BoardCreated'));
	}
});

router.get('/getBoard', (req, res, next) => {
	let id = '5dacfd59e5417c523a0c9518';
	LeaderBoard.findById(id).populate('userScores').then((board) => {
		res.json(board);
	});
});

router.get('/logout', (req, res) => {
	req.logout();
	res.json({ message: 'You are out!' });
});

module.exports = router;
