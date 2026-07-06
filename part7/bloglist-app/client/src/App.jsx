import { useState, useEffect } from "react";
import { Routes, Route, Link, useMatch } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";

import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import NewBlog from "./components/NewBlog";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

import blogService from "./services/blogs";
import loginService from "./services/login";

import { ErrorBoundary, getErrorMessage } from "react-error-boundary";
import { useBlogActions, useNotificationActions } from "./store";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  //const [message, setMessage] = useState(null);
  const { setMessage } = useNotificationActions();
  const { initialize, deleteBlog, getBlog, updateLike } = useBlogActions();

  //const newBlogTogglableRef = useRef()
  const navigate = useNavigate();

  const match = useMatch("/blogs/:id");
  const blog = match ? getBlog(match.params.id) : null;

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const storedUserJSON = window.localStorage.getItem("currentBlogUser");
    if (storedUserJSON) {
      const user = JSON.parse(storedUserJSON);
      if (user && user.token) {
        setUser(user);
        blogService.setToken(user.token);
      }
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userInfo = await loginService.login({ username, password });
      window.localStorage.setItem("currentBlogUser", JSON.stringify(user));
      setUser(userInfo);
      console.log("handleLogin userInfo:", userInfo);
      blogService.setToken(userInfo.token);
      setUsername("");
      setPassword("");
      navigate("/");
      setMessage({ text: `${userInfo.name} logged in.`, type: "success" });
      //return redirect('/')
    } catch (error) {
      setMessage({
        text: "Login failed. Check username/password.",
        type: "error",
      });
      setUsername("");
      setPassword("");
      console.error("caught error ", error);
    }
    console.log("handleLogin called username:", username, "password", password);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    setUser(null);
    window.localStorage.removeItem("currentBlogUser");
  };

  const handleBlogDelete = async (blog) => {
    console.log("delete handler for ", blog);
    if (window.confirm(`Really delete ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog);
      navigate("/");
    }
  };

  const handleLike = async ({ id, likes }) => {
    console.log("updating likes for", id, "to", likes);
    updateLike({ id, likes });
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <h2>Login to BlogList</h2>
      </div>
      <FormControl>
        <TextField
          label="Username"
          value={username}
          name="username"
          autoComplete="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </FormControl>
      <FormControl>
        <TextField
          label="Password"
          type="password"
          value={password}
          autoComplete="current-password"
          name="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </FormControl>
      <div>
        <Button type="submit" variant="contained">
          login
        </Button>
      </div>
    </form>
  );

  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color="inherit" component={Link} sx={style} to="/">
            Home
          </Button>
          {!user && (
            <Button color="inherit" component={Link} sx={style} to="/login">
              Login
            </Button>
          )}
          {user && (
            <Button color="inherit" component={Link} sx={style} to="/newblog">
              New Blog
            </Button>
          )}
          {user && (
            <Button
              color="inherit"
              onClick={handleLogout}
              sx={style}
              name="logout"
            >
              logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div>
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div role="alert">
              <p>Error encountered in Notification:</p>
              <pre>{getErrorMessage(error)}</pre>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
          onReset={() => {
            setMessage(null);
          }}
        >
          <Notification />
        </ErrorBoundary>
      </div>
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div role="alert">
            <p>Error encountered in Routes:</p>
            <pre>{getErrorMessage(error)}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
          </div>
        )}
      >
        <Routes>
          <Route path="/login" element={loginForm()} />
          <Route
            index
            element={<BlogList handleBlogDelete={handleBlogDelete} />}
          />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                updateLike={handleLike}
                deleteBlog={handleBlogDelete}
                user={user}
              />
            }
          />
          <Route path="/newblog" element={<NewBlog />} />
          <Route
            path="/*"
            element={
              <div>
                <h1>404 &mdash; Page not found.</h1>
                <p>
                  The page was not found on the server. Maybe there was
                  something wrong with the link?
                </p>
              </div>
            }
          />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
