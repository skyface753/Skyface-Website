import React from "react";
import apiService from "../services/api-service";
import { useParams } from "react-router-dom";
import BlogPreview from "../components/blog-preview";

export default function ShowProfile() {
  var { username } = useParams();
  const [user, setUser] = React.useState(null);
  const [userBlogs, setUserBlogs] = React.useState(null);

  React.useEffect(() => {
    apiService("users/profile/" + username, {}).then((response) => {
      console.log(response.data);
      setUser(response.data["user"]);
      setUserBlogs(response.data["blogs"]);
    });
  }, []);

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
          <h1>{user.username}</h1>
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
