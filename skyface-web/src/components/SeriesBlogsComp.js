import React from "react";
import apiService from "../services/api-service";
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
        // BlogPreviewOL(seriesBlogs, false, "20pc")
        // seriesBlogs.map((seriesBlog) => {
        //   console.log(seriesBlog);
        //   return (
        //     <li key={seriesBlog._id}>
        //       {BlogPreview(seriesBlog, false, "20px", seriesUrl)}
        //     </li>
        //   );
        // })
        <div>No Blogs found</div>
      )}
    </ul>
  );
}
