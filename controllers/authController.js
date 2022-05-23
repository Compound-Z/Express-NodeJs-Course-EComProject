const res = require("express/lib/response")
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const { attachCookieToResponse, createTokenUser } = require('../utils')
const register = async (req, res) => {
	const { name, email, password } = req.body

	//check if email already existed
	const isEmailExisted = await User.findOne({ email: email })
	if (isEmailExisted) {
		throw new CustomeError.BadRequestError(`The email ${email} already existed. Please try another email.`)
	}

	//set the first user as an admin
	const isFirstUser = await User.countDocuments({}) === 0
	const role = isFirstUser ? 'admin' : 'user'

	const user = await User.create({ name, email, password, role })

	const tokenUser = createTokenUser(user)
	attachCookieToResponse({ res, tokenUser })

	//response
	res.status(StatusCodes.CREATED).json({ user: tokenUser })
}

const login = async (req, res) => {
	//check email and password
	console.log(req.body.password)
	const { email, password } = req.body
	if (!email || !password) {
		throw new CustomError.BadRequestError('Please provide email and password')
	}
	//check if user exist
	const user = await User.findOne({ email: email })
	if (!user) {
		throw new CustomError.UnauthenticatedError('This email does not exist')
	}
	//compare password
	const isPasswordValid = await user.comparePassword(password)
	console.log(`isPwdValid ${isPasswordValid}`)
	if (!isPasswordValid) {
		throw new CustomError.UnauthenticatedError('Wrong password')
	}
	//create cookie and send back
	const tokenUser = createTokenUser(user)
	attachCookieToResponse({ res, tokenUser })
	res.status(StatusCodes.OK).json({ tokenUser })
}


const logout = async (req, res) => {
	res.cookie('token', 'logout', {
		httpOnly: true,
		expires: new Date(Date.now() + 5000)
	})
	res.status(StatusCodes.OK).send('logged out')
}

module.exports = { login, register, logout }