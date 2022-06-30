import React, { useContext } from "react";
import apiService from "../services/api-service";
import { useParams } from "react-router-dom";
import BlogPreviewOL from "../components/blog-preview";
import { AuthContext } from "../App";
import { SkyCloudLoader } from "../components/Loader";

async function checkUsernameFree(username) {
  return await apiService("users/username/free/" + username).then((res) => {
    return res.data.free;
  });
}

export default function ShowProfile() {
  const { state, dispatch } = useContext(AuthContext);
  var { username } = useParams();
  const [user, setUser] = React.useState(null);
  const [userBlogs, setUserBlogs] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [usernameChangeError, setUsernameChangeError] = React.useState(null);

  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [newPassword2, setNewPassword2] = React.useState("");

  React.useEffect(() => {
    apiService("users/profile/" + username, {}).then((response) => {
      console.log(response.data);
      if (response.data.success) {
        setUser(response.data["user"]);
        setUserBlogs(response.data["blogs"]);
      } else {
        setError("User not found");
      }
    });
  }, [username]);
  if (error) {
    return <h1>{error}</h1>;
  }
  if (!user) return <SkyCloudLoader />;

  return (
    <div>
      {user ? (
        <div>
          <img
            src={user.picture || require("../img/default-profile-pic.png")}
            alt="user-profile-pic"
            className="user-profile-pic"
          />
          {state.isLoggedIn && state.user._id === user._id ? (
            <div>
              <label htmlFor="usernameEdit" className="username-edit">
                <b>Username</b>
              </label>
              <input
                id="usernameEdit"
                type="text"
                value={user.username}
                onChange={(e) => {
                  user.username = e.target.value;
                  setUser({ ...user });
                  if (e.target.value.length >= 3) {
                    checkUsernameFree(e.target.value).then((isFree) => {
                      console.log("IsFree2: " + isFree);
                      if (isFree) {
                        setUsernameChangeError(null);
                      } else {
                        setUsernameChangeError("Username taken");
                      }
                    });
                  } else {
                    setUsernameChangeError(
                      "Username must be at least 4 characters"
                    );
                  }
                }}
              />
              {usernameChangeError && username !== user.username ? (
                <p>{usernameChangeError}</p>
              ) : null}

              {username !== user.username ? (
                <button
                  onClick={() => {
                    // Check if min 3 chars
                    if (user.username.length >= 3) {
                      apiService("users/username/change", {
                        newUsername: user.username,
                      }).then((res) => {
                        if (res.data.success) {
                          dispatch({
                            type: "CHANGE_USERNAME",
                            payload: { user: user },
                          });
                          alert("Username changed successfully");
                          window.location = "/users/" + user.username;
                        } else {
                          alert(res.data.message);
                        }
                      });
                    } else {
                      alert("Username must be at least 4 characters");
                    }
                  }}
                >
                  Save Username
                </button>
              ) : null}
            </div>
          ) : (
            <h1>{user.username}</h1>
          )}
          {state.isLoggedIn && state.user._id === user._id ? (
            state.user.provider === "Manuelly" ? (
              <div>
                <h4>Change Password</h4>
                <label htmlFor="oldPassword">
                  <b>Old Password</b>
                </label>
                <input
                  type="password"
                  placeholder="Enter Old Password"
                  name="oldPassword"
                  required
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                  }}
                />
                <label htmlFor="newPassword">
                  <b>New Password</b>
                </label>
                <input
                  type="password"
                  placeholder="Enter New Password"
                  name="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                />
                <label htmlFor="newPassword2">
                  <b>Confirm New Password</b>
                </label>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  name="newPassword2"
                  required
                  value={newPassword2}
                  onChange={(e) => {
                    setNewPassword2(e.target.value);
                  }}
                />
                <button
                  onClick={() => {
                    if (newPassword === newPassword2) {
                      apiService("users/password/change", {
                        oldPassword: oldPassword,
                        newPassword: newPassword,
                      }).then((res) => {
                        if (res.data.success) {
                          alert("Password changed successfully");
                        } else {
                          alert(res.data.message);
                        }
                      });
                    } else {
                      alert("Passwords do not match");
                    }
                  }}
                >
                  Change Password
                </button>
              </div>
            ) : null
          ) : null}
          <p>{user.email}</p>
                  </div>
      ) : (
        <div>Loading...</div>
      )}
      <BlogPreviewOL
        blogList={userBlogs}
        UserIsAdmin={false}
        marginLeft="0px"
      />
    </div>
  );
}
