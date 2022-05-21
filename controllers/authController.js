const res = require("express/lib/response")
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const CustomeError = require('../errors')
const register = async (req, res) => {
	const { name, email, password } = req.body
	const isEmailExisted = User.findOne({ email: email })
	if (isEmailExisted) {
		throw new CustomeError.BadRequestError(`The email ${email} already existed. Please try another email.`)
	}
	const user = await User.create({ name, email, password })
	res.status(StatusCodes.CREATED).json({ user })
}

const login = async (req, res) => {
	res.send('login')
}


const logout = async (req, res) => {
	res.send('logout')
}

module.exports = { login, register, logout }