const config = require('./utils/config')
const express = require('express')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

const app = express()
const Blog = require('./models/blog')

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())
app.use('/api/blogs', blogRouter)

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})