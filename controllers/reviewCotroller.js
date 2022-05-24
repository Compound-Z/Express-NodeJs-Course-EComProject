const Review = require('../models/Review')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const Product = require('../models/Product')
const checkPermission = require('../utils/checkPermission')

const createReview = async (req, res) => {
	const { product: productId } = req.body
	const product = await Product.findOne({ _id: productId })
	if (!product) {
		throw new CustomError.NotFoundError('This product does not exist')
	}

	const isAlreadyHadReview = await Product.findOne({
		product: productId,
		user: req.user.id
	})
	if (isAlreadyHadReview) {
		throw new CustomError.BadRequestError('Already had review for this product')
	}

	req.body.user = req.user.id
	const review = await Review.create(req.body)

	res.status(StatusCodes.CREATED).json(review)
}
const getAllReviews = async (req, res) => {
	const reviews = await Review.find({})
	res.status(StatusCodes.OK).json(reviews)
}
const getSingleReview = async (req, res) => {
	const id = req.params.id
	const review = await Review.findOne({ _id: id })
	if (!review) {
		throw new CustomError.NotFoundError(`Review with id ${id} doesn't exist`)
	}
	res.status(StatusCodes.OK).json(review)
}
const updateReview = async (req, res) => {
	console.log("updateReview")
	res.send("updateReview")
}
const deleteReview = async (req, res) => {
	const id = req.params.id
	const review = await Review.findOne({ _id: id })
	if (!review) {
		throw new CustomError.NotFoundError(`Review with id ${id} doesn't exist`)
	}

	checkPermission(req.user, review.user)
	await review.remove()
	res.status(StatusCodes.OK).json({ msg: "Review deleted!" })
}

module.exports = { createReview, getAllReviews, getSingleReview, updateReview, deleteReview }