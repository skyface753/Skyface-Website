import React from "react";
import BlogPreviewOL from "./blog-preview";

export default function SeriesBlogsComp(seriesBlogs, seriesUrl) {
  if (!seriesBlogs) return <div>No Blogs in this series</div>;
  return (
    <ul className="series-bar">
      {seriesBlogs.length > 0 ? (
        <BlogPreviewOL
          blogList={seriesBlogs}
          UserIsAdmin={false}
          marginLeft="0px"
        />
      ) : (
        
        <div>No Blogs found</div>
      )}
    </ul>
  );
}
