const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   GET api/profile/me
// @desc    Get user current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id
		}).populate('user', ['name', 'avatar']);

		if (!profile) {
			return res.status(400).json({
				msg: 'There is no profile associated with this user'
			});
		}
		res.json(profile);
	} catch (error) {
		console.log(error.message);
		res.status(500).send('Server Error');
	}
});

// @route   POST api/profile
// @desc    Update/Create profile for a user
// @access  Private
router.post(
	'/',
	[auth, [check('status', 'Please enter a status').notEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			status,
			image,
			first_name,
			last_name,
			description,
			slogan,
			website,
			linkedIn,
			github,
			facebook
		} = req.body;

		// init Profile & set req
		const profileFields = {};
		profileFields.user = req.user.id;
		if (status) profileFields.status = status;
		if (image) profileFields.image = image;
		if (first_name) profileFields.first_name = first_name;
		if (last_name) profileFields.last_name = last_name;
		if (description) profileFields.description = description;
		if (slogan) profileFields.slogan = slogan;
		if (website) profileFields.website = website;

		// init social object
		profileFields.social = {};
		if (linkedIn) profileFields.social.linkedIn = linkedIn;
		if (github) profileFields.social.github = github;
		if (facebook) profileFields.social.facebook = facebook;

		try {
			// find profile
			let profile = await Profile.findOne({ user: req.user.id });
			// if exists, update
			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);
				return res.status(200).json(profile);
			}

			// if does not exist, create
			profile = new Profile(profileFields);
			await profile.save();
			res.status(201).json(profile);
		} catch (error) {
			console.log(error);
			res.status(500).send('Server Error');
		}
	}
);

// @route   GET api/profile (index)
// @desc    Get all profiles
// @access  public
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', [
			'name',
			'avatar'
		]);
		res.json(profiles);
	} catch (error) {
		console.log(error.message);
		res.status(500).send('Server Error');
	}
});

// @route   GET api/profile/:id (show)
// @desc    Get one profile
// @access  public
router.get('/:id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.id
		}).populate('user', ['name', 'avatar']);

		if (!profile) {
			return res.status(400).json({ msg: 'Profile not found' });
		}

		res.status(200).send(profile);
	} catch (error) {
		console.log(error.message);
		if (error.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found' });
		}
		res.status(500).send('Server Error');
	}
});

// @route   DELETE api/profile (destroy)
// @desc    Delete profile and user
// @access  private
router.delete('/', auth, async (req, res) => {
	try {
		// Delete profile
		await Profile.findOneAndRemove({ user: req.user.id });
		// Delete user
		await User.findOneAndRemove({ _id: req.user.id });

		res.status(200).json({ msg: 'User deleted' });
	} catch (error) {
		console.log(error.message);
		if (error.kind == 'ObjectId') {
			return res.status(400).json({ msg: 'Profile not found' });
		}
		res.status(500).send('Server Error');
	}
});

module.exports = router;
