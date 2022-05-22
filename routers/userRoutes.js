const userController = require('../controllers/userController')
const express = require('express')
const routerUser = express.Router()

routerUser.route('/').get(userController.getAllUsers)
routerUser.route('/showMe').get(userController.showCurrentUser);
routerUser.route('/updateUser').patch(userController.updateUser);
routerUser.route('/updateUserPassword').patch(userController.updateUserPassword);
routerUser.route('/:id').get(userController.getSingleUser)

module.exports = routerUser