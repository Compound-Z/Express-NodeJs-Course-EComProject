const {
	getAllProducts,
	getSingleProduct,
	createProduct,
	uploadImage,
	updateProduct,
	deleteProduct
} = require('../controllers/productController')

const { getAllReviewsOfAProduct } = require('../controllers/reviewCotroller')
const express = require('express')
const router = express.Router()
const authentication = require('../middleware/authentication')


router.route('/')
	.get(getAllProducts)
	.post(authentication.authenticateUser, authentication.authorizeUserPermission('admin'), createProduct)
router.route('/uploadImage')
	.post(authentication.authenticateUser, authentication.authorizeUserPermission('admin'), uploadImage)
router.route('/:id')
	.get(getSingleProduct)
	.patch(authentication.authenticateUser, authentication.authorizeUserPermission('admin'), updateProduct)
	.delete(authentication.authenticateUser, authentication.authorizeUserPermission('admin'), deleteProduct)
router.route('/:id/reviews').get(getAllReviewsOfAProduct)
module.exports = router