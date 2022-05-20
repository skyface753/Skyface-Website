import React from "react";
import aboutData from "../page-content/about-page.json";

const About = () => {
  return (
    <div
    // style={
    //     {
    //         width: '80%',
    //         margin: '0 auto',
    //         textAlign: 'center',
    //     }
    // }
    >
      <div className="title-container">
        <img
          src={require("../img/about-title.png")}
          width="100%"
          alt="About-Title"
        />
        <div className="title-container-text">
          <h1>{aboutData.header.title}</h1>
          <h2>{aboutData.header.subtitle}</h2>
        </div>
      </div>
      {/* Divider */}
      <div className="divider" />

      {/* About */}
      {(() => {
        var about = aboutData.content;
        var aboutDivs = [];
        console.log(about);
        for (var i = 0; i < about.length; i++) {
          aboutDivs.push(<p>{about[i].text}</p>);
        }
        return aboutDivs;
      })()}
    </div>
  );
};

export default About;
