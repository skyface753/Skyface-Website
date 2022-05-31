import React from "react";
import apiService from "../services/api-service";

export default function SearchPage() {
    const [usersSearchResults, setUsersSearchResults] = React.useState([]);
    const [blogsSearchResults, setBlogsSearchResults] = React.useState([]);
    const [categoriesSearchResults, setCategoriesSearchResults] = React.useState([]);
    const [seriesSearchResults, setSeriesSearchResults] = React.useState([]);

  return (
    <div>
      <h1>Search Page</h1>
        <div>   
            <input type="text" placeholder="Search" onChange={(e) => {
                apiService("search", {searchString: e.target.value}).then(response => {
                    if (response.data.success) {
                        setUsersSearchResults(response.data.users);
                        setBlogsSearchResults(response.data.blogs);
                        setCategoriesSearchResults(response.data.categories);
                        setSeriesSearchResults(response.data.series);
                    } else {
                        console.log(response.data);
                    }
                });
            }}/>
        </div> 
        <div>
            <h2>Users</h2>
            {usersSearchResults.map((user) => {
                return (
                    <div key={user._id}>
                        <h3>{user.username}</h3>
                        </div>
                );
            })}
            <h2>Blogs</h2>
            {blogsSearchResults.map((blog) => {
                return (
                    <div key={blog._id}>
                        <h3>{blog.title}</h3>
                    </div>
                );
            })}
            <h2>Categories</h2>
            {categoriesSearchResults.map((category) => {
                return (
                    <div key={category._id}>
                        <h3>{category.name}</h3>
                        </div>
                );
            })}
            <h2>Series</h2>
            {seriesSearchResults.map((series) => {
                return (
                    <div key={series._id}>
                        <h3>{series.name}</h3>
                        </div>
                );
            })}
            </div>

    </div>
  );
}