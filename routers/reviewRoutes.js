const {
	createReview, getAllReviews, getSingleReview, updateReview, deleteReview
} = require('../controllers/reviewCotroller')
const express = require('express')
const router = express.Router()
const authentication = require('../middleware/authentication')

router.route('/').get(getAllReviews).post(authentication.authenticateUser, createReview)
router
	.route('/:id')
	.get(getSingleReview)
	.patch(authentication.authenticateUser, updateReview)
	.delete(authentication.authenticateUser, deleteReview)

module.exports = router