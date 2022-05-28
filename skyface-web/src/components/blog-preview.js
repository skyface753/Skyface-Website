import apiService from "../services/api-service";

function gotoBlock(url, fromSeriesUrl) {
  if (fromSeriesUrl) {
    window.location.href = `/blogs/${url}` + "?series=" + fromSeriesUrl;
  } else {
    window.location.href = `/blogs/${url}`;
  }
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

export default function BlogPreview(
  currBlogPost,
  UserIsAdmin,
  marginLeft = 0,
  fromSeriesUrl = false
) {
  return (
    <div key={currBlogPost._id} style={{ marginLeft: marginLeft }}>
      <div className="blog-preview">
        <div
          className="blog-preview-title"
          onClick={() => gotoBlock(currBlogPost.url, fromSeriesUrl)}
        >
          <h2>{currBlogPost.title}</h2>
          <p>{currBlogPost.subtitle}</p>
        </div>
        {(() => {
          if (UserIsAdmin) {
            return (
              <div>
                <button
                  onClick={() =>
                    deleteBlog(currBlogPost.title, currBlogPost._id)
                  }
                >
                  Delete
                </button>
              </div>
            );
          }
        })()}
      </div>

      <hr className="blog-divider"></hr>
    </div>
  );
}
