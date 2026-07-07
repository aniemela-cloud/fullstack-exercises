import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useBlogActions } from "../store";

import { Box, Typography, Stack, Link, Button, Divider } from "@mui/material";
const Blog = ({ blog, updateLike }) => {
  const [likes, setLikes] = useState(blog ? blog.likes : 0);
  const navigate = useNavigate();
  const user = useUser();
  const { deleteBlog } = useBlogActions();

  console.log("Blog: ", blog);
  useEffect(() => {
    if (!blog) {
      navigate("/");
    }
  }, [blog, navigate]);

  const onLike = () => {
    blog.likes += 1;
    setLikes(blog.likes);
    updateLike({ id: blog.id, likes: blog.likes });
  };

  const handleBlogDelete = async () => {
    console.log("delete handler for ", blog);
    if (window.confirm(`Really delete ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog);
      navigate("/");
    }
  };

  if (blog) {
    return (
      <Box className="blog" sx={{ m: 2 }}>
        <Typography variant="h4" className="blog_title">
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
                onClick={handleBlogDelete}
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
