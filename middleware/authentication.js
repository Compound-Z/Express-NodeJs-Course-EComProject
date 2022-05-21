const CustomError = require('../errors');
const jwt = require('jsonwebtoken')

const authenticateUser = async (req, res, next) => {
	const token = req.token
	if (!token) {
		throw new CustomError.BadRequestError('Please provide token')
	}

	try {
		const { id, name, role } = jwt.verify(token, process.env.JWT_SECRET)
		req.user = { id, name, role }
		next()
	} catch (error) {

	}
}