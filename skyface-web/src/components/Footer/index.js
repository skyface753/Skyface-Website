import React from "react";
import GitHubSocials from "../Socials/github";

const Footer = () => {
  return (
    <div
      style={{
        width: "100%",
        margin: "0 auto",
        marginTop: "20px",
        textAlign: "center",
        backgroundColor: "#fafafa",
        borderTop: "1px solid #e0e0e0",
        borderBottom: "1px solid #e0e0e0",
        fontSize: "12px",
        fontWeight: "bold",
        color: "#828282",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <p>Copyright &copy; 2020 SkyBlog</p>
      <GitHubSocials link="https://github.com/skyface753"></GitHubSocials>
    </div>
  );
};

export default Footer;
