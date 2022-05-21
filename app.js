require('dotenv').config();
require('express-async-errors') //to automatically apply try-catch to any async function
const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()

//morgan: http request logger
const morgan = require('morgan')

//db
const connectDB = require('./db/connect')

//not found
const notFound = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
//routes
const routerAuth = require('./routers/authRoutes')

//************************************** */	
app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))

app.get('/', (req, res) => {
	console.log(req.cookies)
	res.send('OKE')
})

app.use('/api/v1/auth', routerAuth)

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