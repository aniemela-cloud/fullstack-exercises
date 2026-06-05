const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    if(!blogs || blogs.length === 0) {
        return 0
    }
    return blogs.reduce((sum, item) => sum + item.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }
    let mostLikes = 0
    let bestBlog = null
    
    blogs.forEach((blog) => {
        if (blog.likes > mostLikes) {
            bestBlog = blog
            mostLikes = blog.likes
        }
    });
    return bestBlog
}

const mostBlogs = (blogs) => {
    if (!blogs || blogs.length === 0) {
        return null
    }
    const authorCount = _.countBy(blogs, (blog) => blog.author)
    const mostAuthor = Object.keys(authorCount).reduce((a, b) => authorCount[a] > authorCount[b] ? a : b)
    return {
        author: mostAuthor,
        blogs: authorCount[mostAuthor]
    }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs
}