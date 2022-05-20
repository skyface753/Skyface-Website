import React from "react";
import axios from "axios";
import BlogPreview from "../components/blog-preview";

const baseURL = "http://localhost:5000/blogs";

export default function Blogs() {
  const [posts, setPost] = React.useState(null);

  React.useEffect(() => {
    // setTimeout(() => {
    axios.post(baseURL).then((response) => {
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
        for (let i = 0; i < posts.length; i++) {
          blogDivs.push(BlogPreview(posts[i]));
        }
        return blogDivs;
      })()}
    </div>
  );
}
