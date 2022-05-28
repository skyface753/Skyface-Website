import React from "react";
import apiService from "../services/api-service";
import BlogPreview from "./blog-preview";

export default function SeriesBlogsComp(seriesBlogs, seriesUrl) {
  if (!seriesBlogs) return <div>No Blogs in this series</div>;
  return (
    <ul className="series-bar">
      {seriesBlogs.length > 0 ? (
        seriesBlogs.map((seriesBlog) => {
          console.log(seriesBlog["blog"]);
          return (
            <li key={seriesBlog["blog"]._id}>
              {BlogPreview(seriesBlog["blog"], false, "20px", seriesUrl)}
            </li>
          );
        })
      ) : (
        <div>No Blogs found</div>
      )}
    </ul>
  );
}
