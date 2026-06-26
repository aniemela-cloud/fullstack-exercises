import { useState } from 'react'
const Blog = ({ blog, updateLike, deleteBlog }) => {
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

  const onDelete = () => {
    deleteBlog(blog)
  }

  return (
    <div className="blog" style={blogStyle}>
      <span className="blog_title">{blog.title}</span> by&nbsp;
      <span className="blog_author">{blog.author}</span>
      <button
        name="more toggle"
        onClick={toggleVisibility}
        className="visibility_toggle">
        {visible ? 'less' : 'more'}
      </button>
      <div style={showWhenVisible} className="blog_extra">
        <div className="blog_url">URL: {blog.url}</div>
        <div className="blog_likes">Likes: {likes} <button name="like" onClick={onLike}>like</button></div>
        <div className="blog_user"><em>({blog.user.name})</em></div>
        {deleteBlog && ( /* deleteBlog is undefined if user.id != blog.user.id */
          <div className="blog_delete">
            <button name="delete" onClick={onDelete}>DELETE</button>
          </div>
        )}
      </div>
    </div>
  )
}
export default Blog