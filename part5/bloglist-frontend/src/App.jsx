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

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(error) {
      console.error('caught error ',error)
    }
    console.log('handleLogin called username:',username, 'password', password)
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
      {(!user && loginForm())}
      {(user && blogList())}
    </div>
  )
}

export default App