import loginService from "../services/login";
import blogService from "../services/blogs";
import { useNavigate } from "react-router-dom";

import { TextField, Button, FormControl } from "@mui/material";
import { useState } from "react";
import { useNotificationActions, useUserActions } from "../store";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setMessage } = useNotificationActions();
  const { setUser } = useUserActions();

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userInfo = await loginService.login({ username, password });
      setUser(userInfo);
      blogService.setToken(userInfo.token);
      window.localStorage.setItem("currentBlogUser", JSON.stringify(userInfo));
      setMessage({ text: `${userInfo.name} logged in.`, type: "success" });
      navigate("/");
    } catch (error) {
      setMessage({ text: `Login failed: ${error.message}`, type: "error" });
    }
    setUsername("");
    setPassword("");
  };

  return (
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
};

export default LoginForm;
/*
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
*/
/*
  const handleLogout = (event) => {
    event.preventDefault();
    setUser(null);
    window.localStorage.removeItem("currentBlogUser");
  };
*/
/*
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
*/
