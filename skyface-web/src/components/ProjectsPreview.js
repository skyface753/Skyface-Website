import Arrow from "../img/arrow";
import Star from "../img/star";
import apiService from "../services/api-service";
import CheckIfAdmin from "../services/CheckIfAdmin";

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
            article.text,
            article._id
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

function createProjectsArticle(title, links, text, id) {
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
          {
            CheckIfAdmin() && (
             <div>
              <a href={"/admin/project/edit/" + id} className="home-project-article-edit">
                <span className="home-project-article-edit-text">edit</span>
                {/* <Star /> */}
              </a>
              
              <button
                className="home-project-article-delete"
                onClick={() => {
                  
                  if(window.confirm("Are you sure you want to delete this project?")){
                    apiService("admin/projects/delete/" + id).then((res) => {
                      if (res.data.success) {
                        alert("Project deleted");
                        window.location.href = "/projects";
                      } else {
                        alert("Project not deleted\n" + res.data.message);
                      }
                    });
                  }
                }
              }
              >
                Delete
              </button>
            </div>
            )

          }
        </div>
      </article>
    </li>
  );
}
