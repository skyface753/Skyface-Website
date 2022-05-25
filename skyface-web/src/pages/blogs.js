import React from "react";
import axios from "axios";
import BlogPreview from "../components/blog-preview";
import apiService from "../services/api-service";
import CheckIfAdmin from "../services/CheckIfAdmin";

export default function Blogs() {
  const [posts, setPost] = React.useState(null);

  React.useEffect(() => {
    apiService("blogs").then((response) => {
      setPost(response.data);
    });
  }, []);

  if (!posts) return <div className="loader" />;

  return (
    <div
    // style={
    // 	{
    // 		width: '80%',
    // 		margin: '0 auto',
    // 		textAlign: 'center',
    // 		border: '1px solid #e0e0e0',
    // 		padding: '5%',
    // 	}
    // }
    >
      <div className="title-container">
        <img
          src={require("../img/blogs-title.png")}
          width="100%"
          alt="About-Title"
        />
        <div className="title-container-text">
          <h1>Welcome to SkyBlog</h1>
          <h2>Coding-Blog</h2>
        </div>
      </div>
      {/* Blog Posts */}
      
      {(() => {
        const blogDivs = [];
        var UserIsAdmin = CheckIfAdmin();
        for (let i = 0; i < posts.length; i++) {
          blogDivs.push(BlogPreview(posts[i], UserIsAdmin));
        }
        return blogDivs;
      })()}
    </div>
  );
}
