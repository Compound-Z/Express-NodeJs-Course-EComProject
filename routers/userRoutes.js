const userController = require('../controllers/userController')
const express = require('express')
const routerUser = express.Router()
const authentication = require('../middleware/authentication')

routerUser.route('/').get(authentication.authenticateUser, authentication.authorizeUserPermission('admin'), userController.getAllUsers)
routerUser.route('/showMe').get(authentication.authenticateUser, userController.showCurrentUser);
routerUser.route('/updateUser').patch(authentication.authenticateUser, userController.updateUser);
routerUser.route('/updateUserPassword').patch(authentication.authenticateUser, userController.updateUserPassword);
routerUser.route('/:id').get(authentication.authenticateUser, userController.getSingleUser)

module.exports = routerUser