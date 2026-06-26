import { useState } from 'react'
const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false)

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



  return (
    <div style={blogStyle}>
      {blog.title} by {blog.author} 
      <button 
        name="show toggle"
        onClick={toggleVisibility}>
           { visible ? 'hide' : 'show' } 
      </button>
      <div style={showWhenVisible}>
        <div>URL: {blog.url}</div>
        <div>Likes: {blog.likes} <button name="like">like</button></div>
        <div><em>({blog.user.name})</em></div>
      </div>
    </div>
  )
}
export default Blog