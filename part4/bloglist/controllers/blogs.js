const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  let blogpost=null
  try { 
    blogpost = await Blog.findById(request.params.id) 
  } catch (err) {
    return response.status(404).end()
  }
  if(!blogpost) {
    return response.status(404).end()
  }
  else {
    return response.json(blogpost)
  }
})

blogRouter.post('/', async (request, response) => {
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
  const blog = new Blog(
    {
      author: blogpost_data.author,
      title: blogpost_data.title,
      url: blogpost_data.url,
      likes: blogpost_data.likes ? blogpost_data.likes : 0
    }
  )

  const result = await blog.save()
  return response.status(201).json(result)
/*  blog.save().then((result) => {
    response.status(201).json(result)
  }) */
})

blogRouter.delete('/:id', async (request, response) => {
  let result=null
  try {
    result = await Blog.findByIdAndDelete(request.params.id)
  } catch (err) {
    return response.status(404).json({
      error: err.message
    })
  }
  if (result) {
    return response.status(204).end()
  }
  else {
    return response.status(404).json({
      error: 'unknown id'
    })
  }
})

blogRouter.put('/:id', async (request, response) => {
  let result = null
  // could verify that 'likes' exists in the request.body
  try {
    result = await Blog.findByIdAndUpdate(request.params.id,
      {likes: request.body.likes},
      {returnDocument: 'after'})
  } catch (err) {
    return response.status(404).end()
  }
  if (!result) {
    return response.status(404).end()
  }
  else {
    return response.json(result)
  }
})


module.exports = blogRouter
