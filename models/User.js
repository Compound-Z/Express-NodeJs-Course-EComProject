const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
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

UserSchema.pre('save', async function () {
	const salt = await bcryptjs.genSalt(10)
	this.password = await bcryptjs.hash(this.password, salt)
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
	const isMatched = await bcryptjs.compare(candidatePassword, this.password)
	return isMatched
}
module.exports = mongoose.model('User', UserSchema)