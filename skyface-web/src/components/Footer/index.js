import React from "react";
import GitHubSocials from "../Socials/github";
import RssSocials from "../Socials/rss";

const Footer = () => {
  return (
    <footer className="footer">
      <p>Copyright &copy; 2020 SkyBlog</p>
      <GitHubSocials link="https://github.com/skyface753"></GitHubSocials>
      <RssSocials></RssSocials>
    </footer>
  );
};

export default Footer;
