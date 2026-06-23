const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  let blogpost = null
  try {
    blogpost = await Blog.findById(request.params.id)
  } catch (err) {
    return response.status(404).end()
  }
  if (!blogpost) {
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
  let result = null
  result = await Blog.findByIdAndDelete(request.params.id)
  if (result) {
    return response.status(204).end()
  }
  else {
    return response.status(404).json({
      error: 'unknown id'
    })
  }
})

blogRouter.patch('/:id', async (request, response) => {
  let result = null
  let new_data = {}
  if (request && request.body) {
    if (request.body.likes || request.body.likes === 0) {
      new_data.likes = request.body.likes
    }
    if (request.body.author) {
      new_data.author = request.body.author
    }
    if (request.body.title) {
      new_data.title = request.body.title
    }
    if (request.body.url) {
      new_data.url = request.body.url
    }
  }
  if (Object.keys(new_data).length > 0) {
    try {
      result = await Blog.findByIdAndUpdate(request.params.id,
        new_data,
        { returnDocument: 'after' })
      console.log('await findByIdAndUpdate passed')
    } catch (err) {
      console.log('error caught: ', err)
      return response.status(404).json({
        error: err.message
      })
    }
  }
  // this will also catch the case where no useful data was passed in the request
  if (!result) {
    return response.status(404).end()
  }
  else {
    return response.json(result)
  }
})


module.exports = blogRouter
