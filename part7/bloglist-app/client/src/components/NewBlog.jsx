import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import { useBlogActions, useNotificationActions } from "../store";

const NewBlog = () => {
  const [newAuthor, setAuthor] = useState("");
  const [newTitle, setTitle] = useState("");
  const [newUrl, setUrl] = useState("");

  const { addBlog } = useBlogActions();
  const { setMessage } = useNotificationActions();

  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    addBlog({ author: newAuthor, title: newTitle, url: newUrl });
    setMessage({
      text: `${newTitle} by ${newAuthor} added.`,
      type: "success",
    });
    navigate("/");
    setAuthor("");
    setTitle("");
    setUrl("");
  };

  return (
    <Stack>
      <form onSubmit={onSubmit}>
        <h2>Add New Blog</h2>
        <Stack spacing={2}>
          <div>
            <TextField
              sx={{ width: "50%" }}
              label="Author"
              type="text"
              name="author"
              size="small"
              onChange={({ target }) => setAuthor(target.value)}
              value={newAuthor}
            />
          </div>
          <div>
            <TextField
              sx={{ width: "50%" }}
              label="Blog title"
              type="text"
              size="small"
              onChange={({ target }) => setTitle(target.value)}
              value={newTitle}
            />
          </div>
          <div>
            <TextField
              sx={{ width: "50%" }}
              label="URL"
              type="text"
              size="small"
              onChange={({ target }) => setUrl(target.value)}
              value={newUrl}
            />
          </div>
          <div>
            <Button type="submit">Add Blog</Button>
          </div>
        </Stack>
      </form>
    </Stack>
  );
};

export default NewBlog;
