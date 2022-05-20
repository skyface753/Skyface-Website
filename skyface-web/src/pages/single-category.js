import React from "react";
import { useParams } from "react-router-dom";
import apiService from "../services/api-service";
import BlogPreview from "../components/blog-preview";

export default function SingleCategory() {
  var { categoryUrl } = useParams();

  const [category, setCategory] = React.useState(null);
  const [posts, setPosts] = React.useState(null);

  React.useEffect(() => {
    apiService("blog-categories/" + categoryUrl, {}).then((response) => {
      console.log(response.data);
      setCategory(response.data["category"]);
      setPosts(response.data["blogs"]);
    });
  }, []);

  if (!category) return <div className="loader" />;

  return (
    <div>
      {category ? (
        <div>
          <h1>{category.name}</h1>
          <p>{category.description}</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {posts ? (
        <div>
          {posts.map((post) => {
            console.log(post);
            return BlogPreview(post);
          })}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
