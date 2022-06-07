import Star from "../img/star";
import StarsCollection from "../img/stars-collection";
import apiService from "../services/api-service";

function gotoBlock(url) {
  window.location.href = `/blogs/${url}`;
}

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

export default function BlogPreviewOL(props) {
  var blogsList = props["blogList"];
  var UserIsAdmin = props["UserIsAdmin"] || false;
  var marginLeft = props["marginLeft"] || "0px";
  // console.log("BlogPreviewOL");
  // console.log(props);
  // console.log(blogsList);
  return (
    <section className="blogs-section">
      <ol className="blogs-list">
        {blogsList.map((blog) => {
          return BlogPreviewLI(blog, UserIsAdmin, marginLeft);
        })}
      </ol>
    </section>
  );
}

function BlogPreviewLI(currBlogPost, UserIsAdmin, marginLeft = 0) {
  var datetime = currBlogPost.createdAt.substring(0, 10);
  var blogUrl = "/blogs/" + currBlogPost.url;
  return (
    <li key={currBlogPost._id}>
      <article className="blogs-article">
        {/* <StarsCollection /> */}
        <Star />{" "}
        <div className="blogs-article-title">
          <a href={blogUrl}>{currBlogPost.title}</a>
        </div>
        <div className="blogs-article-subtitle">{currBlogPost.subtitle}</div>
        <time className="home-latest-posts-time" dateTime={datetime}>
          {datetime}
        </time>
      </article>
    </li>
    // <li key={currBlogPost._id} className="blog-preview-li">
    //   {/* <div className="blog-preview"> */}
    //   <article className="blog-preview-article">
    //     <div
    //       className="blog-preview-tusBox"
    //       onClick={() => gotoBlock(currBlogPost.url)}
    //     >
    //       <h2>{currBlogPost.title}</h2>
    //       <p>{currBlogPost.subtitle}</p>
    //       <div className="blog-preview-title">{currBlogPost.title}</div>
    //       <div className="blog-preview-subtitle">{currBlogPost.subtitle}</div>
    //     </div>
    //     {(() => {
    //       if (UserIsAdmin) {
    //         return (
    //           <div>
    //             <button
    //               onClick={() =>
    //                 deleteBlog(currBlogPost.title, currBlogPost._id)
    //               }
    //             >
    //               Delete
    //             </button>
    //           </div>
    //         );
    //       }
    //     })()}
    //     {/* </div> */}

    //     {/* <hr className="blog-divider"></hr> */}
    //   </article>
    // </li>
  );
}
