const jwt = require('jsonwebtoken')

const createJWT = ({ payload }) => {
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME })
}

const verifyJWT = (token) => {
	return jwt.verify(token, process.env.JWT_SECRET)
}

const attachCookieToResponse = ({ res, tokenUser }) => {
	const token = createJWT({ payload: tokenUser })

	//send token using cookie
	const oneDayInMilisecond = 1000 * 60 * 60 * 24
	res.cookie('token', token,
		{
			httpOnly: true,
			expires: new Date(Date.now() + oneDayInMilisecond),
			secure: process.env.NODE_ENV === 'production',
			signed: true,
		})
}

module.exports = { createJWT, verifyJWT, attachCookieToResponse }