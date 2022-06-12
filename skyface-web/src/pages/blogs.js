import React from "react";
import axios from "axios";
import BlogPreviewOL from "../components/blog-preview";
import apiService from "../services/api-service";
import CheckIfAdmin from "../services/CheckIfAdmin";
import { MeetupLoader, SkyCloudLoader } from "../components/Loader";

export default function Blogs() {
  const [posts, setPost] = React.useState(null);

  React.useEffect(() => {
    //Timeout 2 seconds to simulate loading
    // setTimeout(() => {
    apiService("blogs").then((response) => {
      setPost(response.data);
    });
    // }, 2000);
  }, []);

  if (!posts) return <SkyCloudLoader />;

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
      <h1 className="blog-title">{posts.length} Blog Posts</h1>
      {/* <div className="title-container">
        <img
          src={require("../img/blogs-title.png")}
          width="100%"
          alt="About-Title"
        />
        <div className="title-container-text">
          <h1>Welcome to SkyBlog</h1>
          <h2>Coding-Blog</h2>
        </div>
      </div> */}
      {/* Blog Posts */}
      <BlogPreviewOL blogList={posts} UserIsAdmin={CheckIfAdmin()} />
      {/* {(() => {
        const blogDivs = [];
        var UserIsAdmin = CheckIfAdmin();
        BlogPreviewOL(posts, UserIsAdmin)
        for (let i = 0; i < posts.length; i++) {
          blogDivs.push(BlogPreview(posts[i], UserIsAdmin));
        }
        return blogDivs;
      })()} */}
    </div>
  );
}
