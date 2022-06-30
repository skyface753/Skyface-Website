import React from "react";
import apiService from "../services/api-service";
import { useLocation } from "react-router-dom";
import { BlogPreviewLI } from "../components/blog-preview";
import { UserPreview } from "../components/UserPreview";
import "../styles/search_page.css";
function search(searchString, searchCB) {
  apiService("search", { searchString: searchString }).then(function (
    response
  ) {
    if (response.data.success) {
      searchCB(response.data);
    }
  });
}

export default function SearchPage() {
  const location = useLocation();
  const [searchString, setSearchString] = React.useState("");
  const [usersSearchResults, setUsersSearchResults] = React.useState([]);
  const [blogsSearchResults, setBlogsSearchResults] = React.useState([]);
  const [categoriesSearchResults, setCategoriesSearchResults] = React.useState(
    []
  );
  const [seriesSearchResults, setSeriesSearchResults] = React.useState([]);

  React.useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchStringParams = queryParams.get("searchString");
    if (searchStringParams) {
      setSearchString(searchStringParams);
      search(searchStringParams, function (data) {
        setUsersSearchResults(data.users);
        setBlogsSearchResults(data.blogs);
        setCategoriesSearchResults(data.categories);
        setSeriesSearchResults(data.series);
      });
    }
  }, [location.search]);

  return (
    <div>
      <h1>Search Page</h1>
      <div>
        <input
          value={searchString}
          type="text"
          placeholder="Search"
          onChange={(e) => {
            setSearchString(e.target.value);
            search(e.target.value, function (data) {
              setUsersSearchResults(data.users);
              setBlogsSearchResults(data.blogs);
              setCategoriesSearchResults(data.categories);
              setSeriesSearchResults(data.series);
            });
          }}
        />
      </div>
      <div>
        <h2 className="search-titles">Users</h2>
        {usersSearchResults.map((user) => {
          return <UserPreview user={user} />;
        })}
        <section className="search-blogs">
          <h2 className="search-blogs-title">Blogs</h2>
          <ol className="search-blogs-elemets">
            {blogsSearchResults.map((blog) => {
              return BlogPreviewLI(blog, false, "0px");
            })}
          </ol>
        </section>
        <section className="search-categories">
          <h2 className="search-titles">Categories</h2>
          <ol className="search-categories-elemets">
            {categoriesSearchResults.map((category) => {
              return (
                <a
                  key={category._id}
                  href={`/category/${category.URLSearchParams}`}
                >
                  <li>{category.name}</li>
                </a>
              );
            })}
          </ol>
        </section>
        <section className="search-series">
          <h2 className="search-titles">Series</h2>
          <ol className="search-series-elemets">
            {seriesSearchResults.map((series) => {
              return (
                <a key={series._id} href={`/series/${series.url}`}>
                  <li>{series.name}</li>
                </a>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
