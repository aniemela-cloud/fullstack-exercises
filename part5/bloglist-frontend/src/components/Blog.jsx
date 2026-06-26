import { useState } from 'react'
const Blog = ({ blog, updateLike }) => {
  const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  //const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const onLike = () => {
    blog.likes += 1
    setLikes(blog.likes)
    updateLike({ id: blog.id, likes: blog.likes })
  }

  return (
    <div style={blogStyle}>
      {blog.title} by {blog.author}
      <button
        name="show toggle"
        onClick={toggleVisibility}>
        {visible ? 'hide' : 'show'}
      </button>
      <div style={showWhenVisible}>
        <div>URL: {blog.url}</div>
        <div>Likes: {likes} <button name="like" onClick={onLike}>like</button></div>
        <div><em>({blog.user.name})</em></div>
      </div>
    </div>
  )
}
export default Blog