import Blog from './Blog'

const BlogList = ({ blogs, user, updateLike, handleBlogDelete }) => {
  return (
    <div>
      <h2>blogs</h2>
      {blogs.map((blog) => {
        console.log('blogList map: user:',user,'blog',blog)
        const deleteBlog = (user && user.username === blog.user.username ? handleBlogDelete : undefined)
        return (<Blog key={blog.id} blog={blog} updateLike={updateLike} deleteBlog={deleteBlog}/>)
      })}
    </div>
  )
}
export default BlogList