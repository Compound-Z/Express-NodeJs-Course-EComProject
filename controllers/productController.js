const Product = require('../models/Product')
const { StatusCodes } = require('http-status-codes')
const getAllProducts = async (req, res) => {
	res.send('getAllProducts')
}
const getSingleProduct = async (req, res) => {
	res.send('getSingleProduct')
}
const createProduct = async (req, res) => {
	req.body.user = req.user.id
	const product = await Product.create(req.body)
	res.status(StatusCodes.CREATED).json(product)
}
const uploadImage = async (req, res) => {
	res.send('getAllProducts')
}
const updateProduct = async (req, res) => {
	res.send('getAllProducts')
}
const deleteProduct = async (req, res) => {
	res.send('getAllProducts')
}

module.exports = {
	getAllProducts,
	getSingleProduct,
	createProduct,
	uploadImage,
	updateProduct,
	deleteProduct
}
