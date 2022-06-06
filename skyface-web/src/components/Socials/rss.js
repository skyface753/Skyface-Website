import React from "react";
import { RSSURL } from "../../consts";

// function RssIcon() {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width="30"
//       height="30"
//       viewBox="0 0 30 30"
//     >
//       <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-12.832 20c-1.197 0-2.168-.969-2.168-2.165s.971-2.165 2.168-2.165 2.167.969 2.167 2.165-.97 2.165-2.167 2.165zm5.18 0c-.041-4.029-3.314-7.298-7.348-7.339v-3.207c5.814.041 10.518 4.739 10.561 10.546h-3.213zm5.441 0c-.021-7.063-5.736-12.761-12.789-12.792v-3.208c8.83.031 15.98 7.179 16 16h-3.211z" />
//     </svg>
//   );
// }

const RssSocials = (props) => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return (
      <a
        href={RSSURL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          marginLeft: "10px",
        }}
      >
        {/* <RssIcon /> */}
        <img
          src={require("../../img/rss-icon-white.png")}
          width={props.size || "30px"}
          alt="GitHub-Icon"
        />
      </a>
    );
  }
  return (
    <a
      href={props.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        marginLeft: "10px",
      }}
    >
      <img
        src={require("../../img/rss-icon.png")}
        width={props.size || "30px"}
        alt="GitHub-Icon"
      />
      {/* <RssIcon /> */}
    </a>
  );
};

export default RssSocials;
