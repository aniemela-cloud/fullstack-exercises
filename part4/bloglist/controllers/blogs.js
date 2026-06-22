const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const blogpost = await Blog.findById(request.params.id)
  response.json(blogpost)
})

blogRouter.post('/', (request, response) => {
  const blogpost_data = request.body
  if (!blogpost_data) {
    return response.status(400).json({
      error: 'empty request body'
    })
  }
  if (typeof (blogpost_data) !== 'object') {
    return response.status(400).json({
      error: 'malformed request body'
    })
  }
  if (!blogpost_data.author) {
    return response.status(400).json({
      error: 'author field missing'
    })
  }
  if (!blogpost_data.title) {
    return response.status(400).json({
      error: 'title field missing'
    })
  }
  if (!blogpost_data.url) {
    return response.status(400).json({
      error: 'url field missing'
    })
  }
  const blog = new Blog(blogpost_data)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = blogRouter
