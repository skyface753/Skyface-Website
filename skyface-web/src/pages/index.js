import React from "react";

const Home = () => {
  document.title = "SkyBlog - Home";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "Right",
        height: "100vh",
      }}
    >
      <h1>Coding-Blog by Skyface</h1>
    </div>
  );
};

export default Home;
