const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const config = require('config');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const User = require('../../models/User');

// @route   POST api/users
// @desc    create and register a user
// @access  public
router.post(
	'/',
	[
		// check inputs
		check('name', 'Please enter a name').notEmpty(),
		check('email', 'Please enter a valid email').isEmail(),
		check(
			'password',
			'Please enter a password with 8 or more characters'
		).isLength({ min: 8 })
	],
	async (req, res) => {
		// validate inputs
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		// handle request
		const { name, email, password } = req.body;
		try {
			// user already taken
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({
					errors: [
						{
							msg: 'User already exists'
						}
					]
				});
			}

			// get user gravatar
			const avatar = gravatar.url(email, {
				s: '200',
				r: 'pg',
				d: 'mm'
			});

			// user not already taken
			// create user model
			user = new User({
				name,
				email,
				avatar,
				password
			});

			// encrypt user password && save
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
			await user.save();

			//! jwt
			const payload = {
				user: { id: user.id }
			};
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{
					expiresIn: 36000
				},
				(error, token) => {
					if (error) throw error;
					console.log(token);
					res.json({ token });
				}
			);
			res.status(201).send('successfully registered user');
		} catch (error) {
			// throw error
			console.log(error.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;
