const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'user'
	},
	status: {
		type: String,
		required: true
	},
	bio: {
		type: String
	},
	image: {
		type: String
	},
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	description: {
		type: String
	},
	slogan: {
		type: String
	},
	website: {
		type: String
	},
	score: {
		rank: {
			type: Number
		},
		points: {
			type: Number,
			default: 0
		}
	},
	social: {
		linkedIn: {
			type: String
		},
		github: {
			type: String
		},
		facebook: {
			type: String
		}
	},
	// activity: [
	// 	{
	// 		title: {
	// 			type: String,
	// 			required: true
	// 		},
	// 		points: {
	// 			type: Number,
	// 			required: true
	// 		},
	// 		date: {
	// 			type: Date,
	// 			required: true
	// 		},
	// 		icon: {
	// 			type: String,
	// 			required: true
	// 		}
	// 	}
	// ],
	// achievements: [
	// 	{
	// 		title: {
	// 			type: String,
	// 			required: true
	// 		},
	// 		score: {
	// 			type: Number,
	// 			required: true
	// 		},
	// 		difficulty: {
	// 			type: Date,
	// 			required: true
	// 		},
	// 		date: {
	// 			type: Date,
	// 			required: true
	// 		}
	// 	}
	// ],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
