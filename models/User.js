const mongoose = require('mongoose')
const validator = require('validator')
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please provide user name'],
		minlength: 3,
		maxlength: 50
	},
	email: {
		type: String,
		required: [true, 'Please provide email address'],
		unique: [true, 'This email has been used. Try another'],
		validate: {
			validator: validator.isEmail,
			message: 'Please provide valid email'
		}
	},
	password: {
		type: String,
		required: [true, 'Please provide password'],
		minlength: 8
	},
	role: {
		type: String,
		enum: ['admin', 'user'],
		default: 'user'
	}
})

module.exports = mongoose.model('User', UserSchema)