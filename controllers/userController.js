const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookieToResponse, createTokenUser, checkPermission } = require('../utils')

const getAllUsers = async (req, res) => {
	console.log(req.user)
	const users = await User.find({ role: 'user' }).select('-password')
	res.status(StatusCodes.OK).json({ users })
}

const getSingleUser = async (req, res) => {

	const user = await User.findOne({ _id: req.params.id }).select('-password')

	if (!user) {
		throw new CustomError.NotFoundError(`No user with id ${req.params.id}`)
	}

	checkPermission(req.user, user._id)

	res.status(StatusCodes.OK).json({ user })
}

const showCurrentUser = async (req, res) => {
	res.status(StatusCodes.OK).json(req.user)
}

const updateUser = async (req, res) => {
	const { name, email } = req.body
	if (!name || !email) {
		throw new CustomError.BadRequestError('Name or Email is missing')
	}

	const user = await User.findOneAndUpdate(
		{ _id: req.user.id },
		{ name: name, email: email },
		{ new: true, runValidators: true })
	console.log(`user: ${user}`)
	const tokenUser = createTokenUser(user)
	attachCookieToResponse({ res, tokenUser })

	res.status(StatusCodes.OK).json(tokenUser)
}

const updateUserPassword = async (req, res) => {
	const { oldPassword, newPassword } = req.body
	if (!oldPassword || !newPassword) {
		throw new CustomError.BadRequestError('Password missing')
	}

	const user = await User.findOne({ _id: req.user.id })
	//check password
	const isPasswordMatched = user.comparePassword(oldPassword)
	if (!isPasswordMatched) {
		throw new CustomError.UnauthenticatedError('Wrong password')
	}

	//update password
	user.password = newPassword
	await user.save()
	res.status(StatusCodes.OK).json(user)

}

module.exports = {
	getAllUsers,
	getSingleUser,
	showCurrentUser,
	updateUser,
	updateUserPassword
}