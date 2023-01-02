import { useState, useEffect } from 'react';
import apiService from '../../services/api-service';

export default function ShowUsersPage() {
  const [users, setUsers] = useState(null);

  function getUsers() {
    apiService('admin/users/get').then((res) => {
      if (res.data.success) {
        setUsers(res.data.users);
      }
    });
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <table
        className='admin-users-table'
        style={{
          // borderCollapse: 'collapse',
          // border: '1px solid black',
          width: '100%',
          padding: '10px',
          display: 'block',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users &&
            users.map((user) => {
              return (
                <tr key={user._id} style={{}}>
                  <td>{user.username}</td>
                  <td>{user.provider}</td>
                  <td>{user.GitHub_id}</td>
                  <td>{user.Google_Mail}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt='user'
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                        }}
                      />
                    ) : null}
                  </td>
                  <td>
                    <button
                      onClick={async () => {
                        // Confirm delete
                        if (
                          window.confirm(
                            'Are you sure? ALL DATA RELATED TO THIS USER WILL BE TRANSFERRED TO YOU!'
                          )
                        ) {
                          // admin/users/delete/:userID
                          apiService(`admin/users/delete/${user._id}`)
                            .then((res) => {
                              if (res.data.success) {
                                getUsers();
                              } else {
                                window.alert(res.data.message);
                              }
                            })
                            .catch((err) => {
                              window.alert(err);
                            });
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
