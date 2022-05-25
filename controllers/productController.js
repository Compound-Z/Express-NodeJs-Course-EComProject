const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2
const fs = require('fs')

const getAllProducts = async (req, res) => {
	const products = await Product.find({})
	res.status(StatusCodes.OK).json(products)
}
const getSingleProduct = async (req, res) => {
	const productId = req.params.id

	const product = await Product.findOne({ _id: productId }).populate('reviews')
	if (!product) {
		throw new CustomError.NotFoundError(`This product with id ${productId} does not exist`)
	}
	res.status(StatusCodes.OK).json(product)
}
const createProduct = async (req, res) => {
	req.body.user = req.user.id
	const product = await Product.create(req.body)
	res.status(StatusCodes.CREATED).json(product)
}
const uploadImage = async (req, res) => {
	if (!req.files) {
		throw new CustomError.BadRequestError('No File Uploaded');
	}
	const productImage = req.files.image;
	if (!productImage.mimetype.startsWith('image')) {
		throw new CustomError.BadRequestError('Please Upload Image');
	}
	const maxSize = 1024 * 1024;
	if (productImage.size > maxSize) {
		throw new CustomError.BadRequestError('Please upload image smaller 1MB');
	}

	console.log('req img ', req.files.image)
	const result = await cloudinary.uploader.upload(
		req.files.image.tempFilePath,
		{
			use_filename: true,
			folder: '10-ecom'
		}
	)
	fs.unlinkSync(req.files.image.tempFilePath)

	res.status(StatusCodes.CREATED).json({ image: { src: result.secure_url } })
}
const updateProduct = async (req, res) => {
	const productId = req.params.id
	const product = await Product.findOneAndUpdate(
		{ _id: productId },
		req.body,
		{ new: true, runValidators: true })

	if (!product) {
		throw new CustomError.NotFoundError(`This product with id ${productId} does not exist`)
	}
	res.status(StatusCodes.OK).json(product)
}
const deleteProduct = async (req, res) => {
	const productId = req.params.id

	const product = await Product.findOne({ _id: productId })
	if (!product) {
		throw new CustomError.NotFoundError(`This product with id ${productId} does not exist`)
	}

	await product.remove()
	res.status(StatusCodes.OK).json({ msg: "remove product successfully" })
}

module.exports = {
	getAllProducts,
	getSingleProduct,
	createProduct,
	uploadImage,
	updateProduct,
	deleteProduct
}
