import React from "react";
import CodepenButton from "../Socials/Codepen";
import GitHubSocials from "../Socials/github";
import RssSocials from "../Socials/rss";

const Footer = () => {
  return (
    <footer className="footer">
      <p>Copyright &copy; 2022 SkyBlog</p>
      <GitHubSocials link="https://github.com/skyface753"></GitHubSocials>
      <RssSocials />
      <CodepenButton link="https://codepen.io/skyface753" />
      <p
        style={{
          margin: "3px",
        }}
      >
        <a
          href="/impressum"
          style={{
            marginRight: "10px",
          }}
        >
          Impressum
        </a>
        <a href="/privacy-policy">Datenschutz</a>
      </p>
    </footer>
  );
};

export default Footer;
