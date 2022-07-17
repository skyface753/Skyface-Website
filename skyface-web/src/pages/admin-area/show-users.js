import { useState, useEffect } from "react";
import apiService from "../../services/api-service";

export default function ShowUsersPage() {
  const [users, setUsers] = useState(null);
  useEffect(() => {
    apiService("admin/users/get").then((res) => {
      if (res.data.success) {
        setUsers(res.data.users);
      }
    });
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <table
        style={{
          borderCollapse: "collapse",
          border: "1px solid black",
          width: "100%",
          padding: "10px",
        }}
      >
        <thead>
          <tr>
            <th>Username</th>
            <th>Provider</th>
            <th>GitHub ID</th>
            <th>Google Mail</th>
            <th>Role</th>
            <th>Picture</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => {
              return (
                <tr key={user._id} style={{ border: "1px solid black" }}>
                  <td>{user.username}</td>
                  <td>{user.provider}</td>
                  <td>{user.GitHub_id}</td>
                  <td>{user.Google_Mail}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt="user"
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                      />
                    ) : null}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
