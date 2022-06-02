import React from "react";
import apiService from "../services/api-service";
import { useLocation } from "react-router-dom";

function search(searchString, searchCB){
    apiService("search", {searchString: searchString}).then(function(response){
        if(response.data.success){
            searchCB(response.data);
        }
    }
    )

}

export default function SearchPage() {
    const location = useLocation();
    const [searchString, setSearchString] = React.useState("");
    const [usersSearchResults, setUsersSearchResults] = React.useState([]);
    const [blogsSearchResults, setBlogsSearchResults] = React.useState([]);
    const [categoriesSearchResults, setCategoriesSearchResults] = React.useState([]);
    const [seriesSearchResults, setSeriesSearchResults] = React.useState([]);

    React.useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchStringParams = queryParams.get("searchString");
        if(searchStringParams){
            setSearchString(searchStringParams);
            search(searchStringParams, function(data){
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
            <input value={searchString} type="text" placeholder="Search" onChange={(e) => {
                setSearchString(e.target.value);
                search(e.target.value, function(data){
                        setUsersSearchResults(data.users);
                        setBlogsSearchResults(data.blogs);
                        setCategoriesSearchResults(data.categories);
                        setSeriesSearchResults(data.series);
                    
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