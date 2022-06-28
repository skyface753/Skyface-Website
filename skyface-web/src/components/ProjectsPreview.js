import Arrow from "../img/arrow";
import Star from "../img/star";
export default function ProjectsPreview({
  projects,
  UserIsAdmin = false,
  showMoreLink = false,
}) {
  return (
    <section className="hc">
      <h2 className="d">Projects</h2>
      <ol className="home-project-grid">
        {projects.map((article) => {
          return createProjectsArticle(
            article.title,
            article.links,
            article.text
          );
        })}
      </ol>
      {showMoreLink && (
        <a href="/projects/" className="home-more-projects">
          <span className="home-more-project-text">more side projects</span>{" "}
          <Arrow />
        </a>
      )}
    </section>
  );
}

function createProjectsArticle(title, links, text) {
  var articleLinks = [];

  for (var i = 0; i < links.length; i++) {
    var linkKey = "project-" + title + "-" + i;
    articleLinks.push(
      <li key={linkKey}>
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
