import React from "react";

const GitHubSocials = (props) => {
  return (
    <a href={props.link} target="_blank" rel="noopener noreferrer">
      <img
        src={require("../../img/GitHub-PNG/GitHub-Mark-120px-plus.png")}
        width={props.size || "30px"}
        alt="GitHub-Icon"
      />
    </a>
  );
};

export default GitHubSocials;
