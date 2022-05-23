const userController = require('../controllers/userController')
const express = require('express')
const routerUser = express.Router()
const authentication = require('../middleware/authentication')

routerUser.route('/').get(authentication.authenticateUser, authentication.authorizeUserPermission('admin'), userController.getAllUsers)
routerUser.route('/showMe').get(authentication.authenticateUser, userController.showCurrentUser);
routerUser.route('/updateUser').patch(userController.updateUser);
routerUser.route('/updateUserPassword').patch(userController.updateUserPassword);
routerUser.route('/:id').get(authentication.authenticateUser, authentication.authorizeUserPermission('admin'), userController.getSingleUser)

module.exports = routerUser