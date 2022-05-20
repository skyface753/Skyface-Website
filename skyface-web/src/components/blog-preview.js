function gotoBlock(url) {
  window.location.href = `/blogs/${url}`;
}

export default function BlogPreview(currBlogPost) {
  return (
    <div>
      <div
        key={currBlogPost._id}
        className="blog-preview"
        onClick={() => gotoBlock(currBlogPost.url)}
      >
        <div>
          <h2>{currBlogPost.title}</h2>
          <p>{currBlogPost.subtitle}</p>
        </div>
      </div>

      <hr className="blog-divider"></hr>
    </div>
  );
}
