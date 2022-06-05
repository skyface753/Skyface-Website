import React, { useContext } from "react";
import apiService from "../services/api-service";
import { useParams } from "react-router-dom";
import BlogPreview from "../components/blog-preview";
import { AuthContext } from "../App";

async function checkUsernameFree(username) {
  return await apiService("users/username/free/" + username).then((res) => {
    return res.data.free;
  });
  // return isFreeData;
}

export default function ShowProfile() {
  const { state, dispatch } = useContext(AuthContext);
  var { username } = useParams();
  const [user, setUser] = React.useState(null);
  const [userBlogs, setUserBlogs] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [usernameChangeError, setUsernameChangeError] = React.useState(null);

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
  }, []);
  if (error) {
    return <h1>{error}</h1>;
  }
  if (!user) return <div className="loader" />;

  return (
    <div>
      {user ? (
        <div>
          <img
            src={user.picture || require("../img/default-profile-pic.png")}
            alt="user-profile-pic"
            className="user-profile-pic"
          />
          {state.isLoggedIn && state.user._id == user._id ? (
            <div>
              <input
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
              {usernameChangeError && username != user.username ? (
                <p>{usernameChangeError}</p>
              ) : null}

              {username != user.username ? (
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
          <p>{user.email}</p>
          <hr className="blog-divider"></hr>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {(() => {
        const blogsDiv = [];
        for (var i = 0; i < userBlogs.length; i++) {
          blogsDiv.push(BlogPreview(userBlogs[i]));
        }
        return blogsDiv;
      })()}
    </div>
  );
}
