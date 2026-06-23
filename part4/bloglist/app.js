const config = require('./utils/config')
const express = require('express')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const middleWare = require('./utils/middleware.js')
const mongoose = require('mongoose')
const app = express()

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { family: 4 })
app.use(express.json())
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use(middleWare.unknownEndpoint)
app.use(middleWare.mongoErrorHandler)
module.exports = app