import { useState, useEffect } from 'react'
import {
  Routes, Route, Link,
  useMatch,
} from 'react-router-dom'

import { useNavigate } from 'react-router-dom'

import Blog from './components/Blog'
import BlogList from './components/BlogList'
import NewBlog from './components/NewBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [notifyMessage, setNotifyMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  //const newBlogTogglableRef = useRef()
  const navigate = useNavigate()

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(b => b.id === match.params.id ) : null

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a,b) =>  b.likes - a.likes)
      setBlogs( blogs )
    }
    )
  }, [])

  useEffect(() => {
    const storedUserJSON = window.localStorage.getItem('currentBlogUser')
    if (storedUserJSON) {
      const user = JSON.parse(storedUserJSON)
      if(user && user.token) {
        setUser(user)
        blogService.setToken(user.token)
      }
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const userInfo = await loginService.login({ username, password })
      window.localStorage.setItem(
        'currentBlogUser', JSON.stringify(user)
      )
      setUser(userInfo)
      console.log('handleLogin userInfo:',userInfo)
      blogService.setToken(userInfo.token)
      setUsername('')
      setPassword('')
      navigate('/')
      //return redirect('/')
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

  const handleBlogDelete = async (blog) => {
    console.log('delete handler for ', blog)
    if (window.confirm(`Really delete ${blog.title} by ${blog.author}?`)) {
      const result = await blogService.deleteBlog(blog)
      if (result && result.status === 204) {
        const filteredBlogs = blogs.filter((b) => b.id !== blog.id)
        setBlogs(filteredBlogs)
      }
      navigate('/')
    }
  }

  const createBlog = async (newBlogData) => {
    console.log('createBlog got newBlogData:',newBlogData)
    const blogdata = await blogService.create(newBlogData)
    console.log('blogdata from blogService', blogdata)
    setNotifyMessage(`${blogdata.title} by ${blogdata.author} added.`)
    setTimeout(() => setNotifyMessage(null), 5000)
    setBlogs(blogs.concat(blogdata))
    navigate('/')
    //newBlogTogglableRef.current.toggleVisibility()
  }

  const updateLike = async ({ id, likes }) => {
    console.log('updating likes for',id,'to',likes)
    await blogService.update({ id, likes })
    const resortedBlogs = blogs.toSorted((a,b) => b.likes - a.likes)
    setBlogs(resortedBlogs)
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
  /*  return (
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
  ) */
  const padding = { padding: 5 }
  return (
    <div>
      <div>
        <Link style={padding} to="/">Home</Link>
        {!user && (<Link style={padding} to="/login">Login</Link>)}
        {user && (<Link style={padding} to="/newblog">New Blog</Link>)}
        {user && (<button onClick={handleLogout} name="logout">logout</button>)}
      </div>
      <div>
        <Notification message={notifyMessage} className="notice" />
        <Notification message={errorMessage} className="error" />
      </div>
      <Routes>
        <Route path="/login" element = {loginForm()}/>
        <Route index element = {
          <BlogList blogs={blogs} handleBlogDelete={handleBlogDelete} updateLike={updateLike} />
        } />
        <Route path="/blogs/:id" element = {
          <Blog blog={blog} updateLike={updateLike} deleteBlog={handleBlogDelete} user={user}/>
        } />
        <Route path="/newblog" element = {
          <NewBlog newBlog={createBlog}/>
        } />
      </Routes>
    </div>
  )
}

export default App