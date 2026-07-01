import { Link } from 'react-router-dom'
import Blog from './Blog'

const BlogList = ({ blogs }) => {
  return (
    <div>
      <h2>blogs</h2>
      <ul>
        {blogs.map((blog) => {
          //console.log('blogList map: user:',user,'blog',blog)
          //const deleteBlog = (user && user.username === blog.user.username ? handleBlogDelete : undefined)
          //return (<Blog key={blog.id} blog={blog} updateLike={updateLike} deleteBlog={deleteBlog}/>)
          return (
            <li key={blog.id}>
              <Link to={`blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
export default BlogList