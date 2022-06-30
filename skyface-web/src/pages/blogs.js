import React from "react";
import BlogPreviewOL from "../components/blog-preview";
import apiService from "../services/api-service";
import CheckIfAdmin from "../services/CheckIfAdmin";
import { SkyCloudLoader } from "../components/Loader";

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
   
    >
      <h1 className="blog-title">{posts.length} Blog Posts</h1>
   
      {/* Blog Posts */}
      <BlogPreviewOL blogList={posts} UserIsAdmin={CheckIfAdmin()} />
      
    </div>
  );
}
