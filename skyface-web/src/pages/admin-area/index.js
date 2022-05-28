import React from "react";

export default function AdminHome() {
  return (
    <div>
      <h1>Admin Home</h1>
      <a href="/admin/show-files">Show Files</a>
      <br />
      <a href="/admin/create-blog">Create Blog</a>
      <br />
      <a href="/admin/create-category">Create Category</a>
      <br />
      <a href="/admin/create-series">Create Series</a>
    </div>
  );
}
