const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

//should be change to post
router.route('/login').get(authController.login)

module.exports = router