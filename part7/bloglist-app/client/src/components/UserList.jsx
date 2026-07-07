import { Link } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";

const UserList = () => {
  const users = [
    { name: "Hardcoded Man", username: "hcone", blogs: [1, 2, 3] },
    { name: "Hardcoded WoMan", username: "hctwo", blogs: [1, 2, 3, 4, 5] },
  ];
  return (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => {
              //console.log('blogList map: user:',user,'blog',blog)
              //const deleteBlog = (user && user.username === blog.user.username ? handleBlogDelete : undefined)
              //return (<Blog key={blog.id} blog={blog} updateLike={updateLike} deleteBlog={deleteBlog}/>)
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link to={`users/${user.id}`}>{user.name}</Link>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default UserList;
