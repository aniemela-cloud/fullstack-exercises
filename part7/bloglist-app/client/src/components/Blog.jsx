import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Typography, Stack, Link, Button, Divider } from "@mui/material";
const Blog = ({ user, blog, updateLike, deleteBlog }) => {
  //const [visible, setVisible] = useState(false)
  const [likes, setLikes] = useState(blog ? blog.likes : 0);
  //const hideWhenVisible = { display: visible ? 'none' : '' }
  //const showWhenVisible = { display: visible ? '' : 'none' }
  const navigate = useNavigate();

  useEffect(() => {
    if (!blog) {
      navigate("/");
    }
  }, [blog, navigate]);

  // const toggleVisibility = () => {
  //   setVisible(!visible)
  // }

  const onLike = () => {
    blog.likes += 1;
    setLikes(blog.likes);
    updateLike({ id: blog.id, likes: blog.likes });
  };

  const onDelete = () => {
    deleteBlog(blog);
  };
  if (blog) {
    return (
      <Box className="blog" sx={{ m: 2 }}>
        <Typography variant="h3" className="blog_title">
          {blog.title}
        </Typography>
        <Typography variant="subtitle1" className="blog_author">
          {blog.author}
        </Typography>
        <Divider />
        <Stack spacing={1} sx={{ marginTop: 3 }}>
          <Link className="blog_url" href={blog.url}>
            {blog.url}
          </Link>
          <div className="blog_likes">Likes: {likes}</div>
          <div className="blog_user">
            <em>
              Added by {blog.user ? blog.user.name : "missing information"}
            </em>
          </div>
          <Stack direction="row">
            {user && (
              <Button
                variant="outlined"
                name="like"
                color="secondary"
                onClick={onLike}
              >
                like
              </Button>
            )}
            {user && blog.user && user.username === blog.user.username && (
              <Button
                name="delete"
                variant="outlined"
                color="error"
                onClick={onDelete}
              >
                DELETE
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>
    );
  }
};
export default Blog;
