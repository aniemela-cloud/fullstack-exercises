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
import { useEffect } from "react";
import userService from "../services/users";
import { useState } from "react";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("in useEffect of UserList");
    async function loadUsers() {
      const loadedUsers = await userService.getAll();
      console.log("async loadUsers()", loadedUsers);
      if (loadedUsers) {
        setUsers(loadedUsers);
      }
    }
    loadUsers();
  }, [setUsers]);
  if (!users || users.length < 1) {
    return (
      <div>
        <h2>Users</h2>
        <div>No registered users.</div>
      </div>
    );
  }
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
