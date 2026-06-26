import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [notifyMessage, setNotifyMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const newBlogTogglableRef = useRef()

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
      blogService.setToken(user.token)
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
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch(error) {
      setErrorMessage('Login failed. Check username/password.')
      setTimeout(() => setErrorMessage(null), 5000)
      setUsername('')
      setPassword('')
      console.error('caught error ',error)
    }
    console.log('handleLogin called username:',username, 'password', password)
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('currentBlogUser')
  }

  const createBlog = async (newBlogData) => {
    console.log('createBlog got newBlogData:',newBlogData)
    const blogdata = await blogService.create(newBlogData)
    setNotifyMessage(`${blogdata.title} by ${blogdata.author} added.`)
    setTimeout(() => setNotifyMessage(null), 5000);
    setBlogs(blogs.concat(blogdata))
    newBlogTogglableRef.current.toggleVisibility()
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
            name="username"
            autoComplete='username'
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
            autoComplete='current-password'
            name="password"
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
      <Notification message={notifyMessage} className="notice" />
      <Notification message={errorMessage} className="error" />
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in <button onClick={handleLogout} name="logout">logout</button></p>
          <Togglable buttonLabel='Add a blog' ref={newBlogTogglableRef}>
            <NewBlog
              newBlog={createBlog}
            />
          </Togglable>
          {blogList()}
        </div>
        )}
    </div>
  )
}

export default App