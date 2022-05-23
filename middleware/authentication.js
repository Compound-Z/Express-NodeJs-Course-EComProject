const CustomError = require('../errors');
const jwt = require('../utils/jwt')

const authenticateUser = async (req, res, next) => {
	const token = req.signedCookies.token
	if (!token) {
		throw new CustomError.BadRequestError('Authentication invalid')
	} else {
		console.log(token)
	}

	try {
		const { id, name, role } = jwt.verifyJWT(token)
		req.user = { id, name, role }
		next()
	} catch (error) {
		throw new CustomError.UnauthenticatedError('Authentication Invalid');
	}
}

const authorizeUserPermission = (...roles) => {
	return async (req, res, next) => {
		if (!(roles.includes(req.user.role))) {
			throw new CustomError.UnauthorizedError('Permission denied!')
		} else {
			next()
		}
	}
}

module.exports = { authenticateUser, authorizeUserPermission }