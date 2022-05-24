const CustomError = require('../errors');

const checkPermission = (srcUser, targetUserId) => {
	if (srcUser.role === 'admin') return
	if (srcUser.id === targetUserId.toString()) return
	throw new CustomError.UnauthorizedError('You are not authorized to perform this action')
}

module.exports = checkPermission