const res = require("express/lib/response")
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomeError = require('../errors')
const { createJWT } = require('../utils')
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

	const tokenUser = {
		id: user._id,
		name: user.name,
		role: user.role
	}
	const token = createJWT({ payload: tokenUser })

	//response
	res.status(StatusCodes.CREATED).json({ user: tokenUser, token: token })
}

const login = async (req, res) => {
	res.send('login')
}


const logout = async (req, res) => {
	res.send('logout')
}

module.exports = { login, register, logout }