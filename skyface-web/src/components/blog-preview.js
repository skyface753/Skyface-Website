import Star from "../img/star";
import StarsCollection from "../img/stars-collection";
import apiService from "../services/api-service";

// function gotoBlock(url) {
//   window.location.href = `/blogs/${url}`;
// }

function deleteBlog(blogTitle, blogId) {
  //Confirm delete
  if (
    window.confirm("Are you sure you want to delete ''" + blogTitle + "''?")
  ) {
    console.log("Delete Blog " + blogTitle + " with id " + blogId);
    apiService("admin/blogs/delete/" + blogId).then((response) => {
      if (response.data.success) {
        alert("Blog deleted successfully");
        window.location.href = "/blogs";
      }
    });
  }
}

export default function BlogPreviewOL({
  blogList,
  UserIsAdmin = false,
  marginLeft = 0,
}) {
  // var blogsList = props["blogList"];
  // var UserIsAdmin = props["UserIsAdmin"] || false;
  // var marginLeft = props["marginLeft"] || "0px";
  // console.log("BlogPreviewOL");
  // console.log(props);
  // console.log(blogsList);
  return (
    <section className="blogs-section">
      <ol className="blogs-list">
        {blogList.map((blog) => {
          return BlogPreviewLI(blog, UserIsAdmin, marginLeft);
        })}
      </ol>
    </section>
  );
}

export function BlogPreviewLI(currBlogPost, UserIsAdmin, marginLeft = 0) {
  // console.log(currBlogPost);
  try {
    var datetime = currBlogPost.createdAt.substring(0, 10);
  } catch (e) {
    var datetime = "";
  }
  var blogUrl = "/blogs/" + currBlogPost.url;
  return (
    <li key={currBlogPost._id}>
      <article className="blogs-article">
        <Star />{" "}
        <div className="blogs-article-title">
          <a href={blogUrl}>{currBlogPost.title}</a>
        </div>
        <div className="blogs-article-subtitle">{currBlogPost.subtitle}</div>
        <time className="home-latest-posts-time" dateTime={datetime}>
          {datetime}
        </time>
        {UserIsAdmin && (
          <button
            className="blogs-article-delete"
            onClick={() => deleteBlog(currBlogPost.title, currBlogPost._id)}
          >
            Delete
          </button>
        )}
      </article>
    </li>
  );
}
