import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
const Blog = ({ user, blog, updateLike, deleteBlog }) => {
  //const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog ? blog.likes : 0)
  //const hideWhenVisible = { display: visible ? 'none' : '' }
  //const showWhenVisible = { display: visible ? '' : 'none' }
  const navigate = useNavigate()

  useEffect(() => {
    if(!blog) {
      navigate('/')
    }
  }, [blog, navigate])

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    //border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  // const toggleVisibility = () => {
  //   setVisible(!visible)
  // }

  const onLike = () => {
    blog.likes += 1
    setLikes(blog.likes)
    updateLike({ id: blog.id, likes: blog.likes })
  }

  const onDelete = () => {
    deleteBlog(blog)
  }
  if (blog) {
    return (
      <div className="blog" style={blogStyle}>
        <h3 className="blog_title">{blog.title}</h3>
        <p className="blog_author">{blog.author}</p>
        <div className="blog_url">URL: <a href={blog.url}>{blog.url}</a></div>
        <div className="blog_likes">Likes: {likes}
          {user && (<button name="like" onClick={onLike}>like</button>)}</div>
        <div className="blog_user"><em>({blog.user ? blog.user.name : 'missing information'})</em></div>
        {user && blog.user && user.username === blog.user.username && (
          <div className="blog_delete">
            <button name="delete" onClick={onDelete}>DELETE</button>
          </div>
        )}
      </div>
    )
  }
}
export default Blog