require('dotenv').config();
require('express-async-errors') //to automatically apply try-catch to any async function
const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()

//morgan: http request logger
const morgan = require('morgan')

//express file upload
const expressFile = require('express-fileupload')
//cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});
//db
const connectDB = require('./db/connect')

//middleware
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

//routes
const routerAuth = require('./routers/authRoutes')
const routerUser = require('./routers/userRoutes')
const routerProduct = require('./routers/productRoutes')

//************************************** */	
app.use(morgan('tiny'))
app.use(express.json())
app.use(expressFile({ useTempFiles: true }))
app.use(cookieParser(process.env.JWT_SECRET))

app.get('/', (req, res) => {
	console.log(req.cookies)
	res.send('OKE')
})

app.use('/api/v1/auth', routerAuth)
app.use('/api/v1/users', routerUser)
app.use('/api/v1/products', routerProduct)


app.use(notFound)
app.use(errorHandlerMiddleware)
// Q: why is 5000?
const port = process.env.PORT || 5000


//************************************** */
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI)
		app.listen(port, () => {
			console.log(`Server is running at ${port}...`);
		})
	} catch (error) {
		console.log(`Error while starting server: ${error}`);
	}
}

start()