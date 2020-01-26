const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// require User model
const User = require('../../models/User');

// @route   GET api/auth
// @desc    test route for auth
// @access  Private
router.get('/', auth, async (req, res) => {
	const { id } = req.user;
	try {
		const user = await User.findById(id).select('-password');
		res.json(user);
	} catch (error) {
		console.log(error.message);
		res.status(500).send('Server Error');
	}
});

// @route   POST api/auth
// @desc    login a user
// @access  public
router.post(
	'/',
	[
		check('email', 'Please enter a valid email').isEmail(),
		check('password', 'Please enter a valid password').notEmpty()
	],
	async (req, res) => {
		// validate inputs
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		// handle request
		const { email, password } = req.body;
		try {
			// user doesn't exist
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({
					errors: [{ msg: 'Invalid Credentials' }]
				});
			}

			// user exists
			const isMatch = await bcrypt.compare(password, user.password);

			// passwords dont match
			if (!isMatch) {
				return res.status(400).json({
					errors: [{ msg: 'Invalid Credentials' }]
				});
			}

			// passwords match
			res.status(200).send('User logged in');

			//! jwt
			const payload = {
				user: { id: user.id }
			};
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 36000 },
				(error, token) => {
					if (error) throw error;
					console.log(token);
					res.json({ token });
				}
			);
		} catch (error) {
			console.log(error.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
