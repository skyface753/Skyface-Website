import React from "react";
import Star from "../img/star";
import Arrow from "../img/arrow";
import apiService from "../services/api-service";
import {
  CloudLoader,
  CloudsRainLoader,
  MeetupLoader,
  SkyCloudLoader,
} from "../components/Loader";
// import { Meetup as Loader } from "../components/Loader";

var ProjectArticles = [
  {
    title: "SkyManager",
    links: [
      {
        text: "backend",
        href: "https://github.com/skyface753/SkyManager",
      },
      {
        text: "frontend",
        href: "https://github.com/skyface753/SkyManager-Frontend-Public",
      },
      {
        text: "demo",
        href: "https://demo.skymanager.net",
      },
    ],
    text: "A Web, IOS and Android App for managing tickets, customers and documents build with Flutter and NodeJS",
  },
  {
    title: "SkyTok",
    links: [
      {
        text: "code",
        href: "https://github.com/skyface753/SkyTok-Public",
      },
    ],
    text: "A Replica of the TikTok App, build with Flutter and NodeJS",
  },
  {
    title: "SkyBlog (this)",
    links: [
      {
        text: "code",
        href: "https://github.com/skyface753/Skyface-Website",
      },
      {
        text: "web",
        href: "https://www.skyface.de/",
      },
    ],
    text: "My personal blog, build with React and NodeJS",
  },
];

function createProjectsArticle(title, links, text) {
  var articleLinks = [];

  for (var i = 0; i < links.length; i++) {
    var linkKey = "project-" + title + "-" + i;
    articleLinks.push(
      <li>
        <a href={links[i].href} target="_blank" rel="noopener noreferrer">
          {links[i].text}
        </a>
      </li>
    );
  }
  var key = "project-" + title;
  return (
    <li key={key}>
      <article className="home-project-article">
        <Star />
        <div>
          <div className="home-project-article-title">{title}</div>
          <ul className="home-project-article-links">{articleLinks}</ul>
          <p className="home-project-article-text">{text}</p>
        </div>
      </article>
    </li>
  );
}

function createPostsArticle(title, url, datetime) {
  var url = "/blogs/" + url;
  return (
    <li key={url}>
      <article className="home-latest-posts-article">
        <Star />{" "}
        <div className="home-latest-posts-article-title">
          <a href={url}>{title}</a>
        </div>
        <time className="home-latest-posts-time" dateTime={datetime}>
          {datetime}
        </time>
      </article>
    </li>
  );
}

const Home = () => {
  const [latestPosts, setLatestPosts] = React.useState(null);

  React.useEffect(() => {
    //Timeout 2 seconds to simulate loading
    // setTimeout(() => {
    apiService("blogs/last5").then((response) => {
      if (response.data.success) {
        setLatestPosts(response.data["blogs"]);
      }
    });
    // }, 500);
  }, []);
  console.log(latestPosts);

  document.title = "SkyBlog - Home";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        // alignItems: "Right",
        // height: "100vh",
        flexDirection: "column",
      }}
    >
      {/* <CloudLoader /> */}
      {/* <CloudsRainLoader /> */}

      <h1 className="home-title animate__animated animate__slideInUp">
        Hi, I'm Sebastian
      </h1>
      <p className="home-description">
        I'm a <strong>computer science student </strong>
        in <strong>Darmstadt</strong>. I develop web and mobile apps as a hobby{" "}
        <strong>fullstack </strong>developer. This is my site,{" "}
        <strong>SkyBlog</strong> (build with React and NodeJS), where I blog and
        share whatever side projects I've been working on.
      </p>
      {/* <div className="y"> */}
      <div className="home-connect">
        <Star />
        <strong
          style={{
            marginLeft: "10px",
          }}
        >
          Socials
        </strong>
        <p className="home-connect-text">
          You can find me on{" "}
          <strong>
            <a
              href="https://twitter.com/skyface_99"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </strong>
          ,{" "}
          <strong>
            <a
              href="https://github.com/skyface753"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </strong>
          , and{" "}
          <strong>
            <a
              href="https://de.linkedin.com/in/sebastian-j%C3%B6rz-01a708232/en?trk=people-guest_people_search-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </strong>
          .
        </p>
      </div>
      {/* Latest Blogs */}
      <section className="home-latest-posts">
        <h2 className="home-latest-posts-title">Latest Blog Posts</h2>
        <ol className="home-latest-posts-elemets">
          {latestPosts ? (
            latestPosts.map((post) => {
              return createPostsArticle(
                post.title,
                post.url,
                post.createdAt.substring(0, 10)
              );
            })
          ) : (
            <SkyCloudLoader />
          )}
          {/* {createPostsArticle(
            "SkyBlog - A Blog for Myself",
            "url-test-12",
            "2022-06-04"
          )} */}
        </ol>
        <a href="/blogs/" className="home-latest-posts-more">
          <span className="home-latest-posts-text">more blog posts</span>{" "}
          <Arrow />
        </a>
      </section>
      {/* Projects */}
      <section className="hc">
        <h2 className="d">Favorite Projects</h2>
        <ol className="home-project-grid">
          {ProjectArticles.map((article) => {
            return createProjectsArticle(
              article.title,
              article.links,
              article.text
            );
          })}
        </ol>
        <a href="/projects/" className="home-more-projects">
          <span className="home-more-project-text">more side projects</span>{" "}
          <Arrow />
          {/* <svg aria-hidden="true" className="kc">
            <use xlink:href="#arrow"></use>
          </svg> */}
        </a>
      </section>
      {/* </div> */}
    </div>
  );
};

export default Home;
