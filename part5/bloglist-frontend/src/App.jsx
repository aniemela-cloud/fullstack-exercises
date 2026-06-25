import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const storedUserJSON = window.localStorage.getItem('currentBlogUser')
    if (storedUserJSON) {
      const user = JSON.parse(storedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem(
        'currentBlogUser', JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(error) {
      console.error('caught error ',error)
    }
    console.log('handleLogin called username:',username, 'password', password)
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('currentBlogUser')
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h2>login</h2>
      </div>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <div>
        <button type="submit">login</button>
      </div>
    </form>
  )
  const blogList = () => (
    <div>
      <h2>blogs</h2>
        {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
        )}
    </div>
  )
  return (
    <div>
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          {blogList()}
        </div>
        )}
    </div>
  )
}

export default App