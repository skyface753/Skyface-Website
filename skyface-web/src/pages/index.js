import React from "react";
import Star from "../img/star";
import Arrow from "../img/arrow";
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
        text: "Blog",
        href: "https://www.skyface.de/index.php/blog/",
      },
    ],
    text: "My personal blog, build with React and NodeJS",
  },
];

function createProjectsArticle(title, links, text) {
  var articleLinks = [];
  for (var i = 0; i < links.length; i++) {
    articleLinks.push(
      <li>
        <a href={links[i].href} target="_blank" rel="noopener noreferrer">
          {links[i].text}
        </a>
      </li>
    );
  }
  return (
    <li>
      <article class="home-project-article">
        <Star />
        <div>
          <div class="home-project-article-title">{title}</div>
          <ul class="home-project-article-links">{articleLinks}</ul>
          <p class="home-project-article-text">{text}</p>
        </div>
      </article>
    </li>
  );
}

function createPostsArticle(title, url, datetime) {
  return (
    <li>
      <article class="home-latest-posts-article">
        <Star />{" "}
        <div class="home-latest-posts-article-title">
          <a href="/blogs/{url}">{title}</a>
        </div>
        <time class="home-latest-posts-time" datetime={datetime}>
          {datetime}
        </time>
      </article>
    </li>
  );
}

const Home = () => {
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
      <h1 className="home-title">Hi, I'm Sebastian</h1>
      <p class="home-description">
        I'm a <strong>computer science student </strong>
        in <strong>Darmstadt</strong>. I develop web and mobile apps as a hobby{" "}
        <strong>fullstack </strong>developer. This is my site,{" "}
        <strong>SkyBlog</strong> (build with React and NodeJS), where I blog and
        share whatever side projects I've been working on.
      </p>
      {/* <div class="y"> */}
      <div class="home-connect">
        <Star />
        <strong
          style={{
            marginLeft: "10px",
          }}
        >
          Let's Connect
        </strong>
        <p class="home-connect-text">
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
              href="https://www.linkedin.com/in/sebastian-j%C3%B6rz-01a708232/"
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
      <section class="home-latest-posts">
        <h2 class="home-latest-posts-title">Latest Blog Posts</h2>
        <ol class="home-latest-posts-elemets">
          {createPostsArticle(
            "SkyBlog - A Blog for Myself",
            "url-test-12",
            "2022-06-04"
          )}
        </ol>
        <a href="/blogs/" class="home-latest-posts-more">
          <span class="home-latest-posts-text">more blog posts</span> <Arrow />
        </a>
      </section>
      {/* Projects */}
      <section class="hc">
        <h2 class="d">Favorite Projects</h2>
        <ol class="home-project-grid">
          {ProjectArticles.map((article) => {
            return createProjectsArticle(
              article.title,
              article.links,
              article.text
            );
          })}
        </ol>
        <a href="/projects/" class="home-more-projects">
          <span class="home-more-project-text">more side projects</span>{" "}
          <Arrow />
          {/* <svg aria-hidden="true" class="kc">
            <use xlink:href="#arrow"></use>
          </svg> */}
        </a>
      </section>
      {/* </div> */}
    </div>
  );
};

export default Home;
