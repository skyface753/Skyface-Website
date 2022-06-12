import React from "react";
import apiService from "../services/api-service";
import { useParams } from "react-router-dom";
import BlogPreview from "../components/blog-preview";
import SeriesBlogsComp from "../components/SeriesBlogsComp";
import { MeetupLoader, SkyCloudLoader } from "../components/Loader";
import CheckIfAdmin from "../services/CheckIfAdmin";
import { useDrag } from "react-dnd";

export default function SingleSeries() {
  var { seriesUrl } = useParams();
  var userIsAdmin = CheckIfAdmin();

  const [series, setSeries] = React.useState(null);
  const [seriesBlogs, setSeriesBlogs] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);
  const [editSeries, setEditSeries] = React.useState(null);

  React.useEffect(() => {
    apiService("series/" + seriesUrl).then((response) => {
      console.log(response.data);
      setSeries(response.data["series"]);
      setSeriesBlogs(response.data["seriesBlogs"]);
      setEditSeries(response.data["series"]);
    });
  }, []);

  if (!series || !seriesBlogs) return <SkyCloudLoader />;

  return (
    <div>
      {editMode ? (
        <div>
          <input
            type="text"
            value={editSeries.name}
            onChange={(e) => {
              editSeries.name = e.target.value;
              setEditSeries({ ...editSeries });
            }}
          />
          <input
            type="text"
            value={editSeries.description}
            onChange={(e) => {
              editSeries.description = e.target.value;
              setEditSeries({ ...editSeries });
            }}
          />
          <input
            type="text"
            value={editSeries.url}
            onChange={(e) => {
              editSeries.url = e.target.value;
              setEditSeries({ ...editSeries });
            }}
          />

          <button
            onClick={() => {
              apiService("admin/series/update", { series: editSeries }).then(
                (response) => {
                  if (response.data.success) {
                    alert("Series updated");
                    setEditMode(false);
                    window.location = "/series/" + editSeries.url;
                  }
                }
              );
            }}
          >
            Update
          </button>
        </div>
      ) : (
        <div>
          <h1>{series.name}</h1>
          <p>{series.description}</p>
          {/* <hr className="blog-divider"></hr> */}
        </div>
      )}
      {userIsAdmin && (
        <button
          onClick={() => {
            setEditMode(!editMode);
          }}
        >
          {editMode ? "Cancle" : "Edit"}
        </button>
      )}
      {
        editMode ? (
          <div>HI</div>
        ) : (
          // (() => {
          //   var blogs = [];
          //   for (var i = 0; i < seriesBlogs.length; i++) {
          //     blogs.push(
          //       <div key={seriesBlogs[i]._id}>
          //         {/* Position UP */}
          //         <button
          //           onClick={() => {
          //             console.log("up");
          //             console.log("I", i);

          //             if (i > 0) {
          //               var newSeriesBlogs = seriesBlogs;
          //               var temp = newSeriesBlogs[i];
          //               newSeriesBlogs[i] = newSeriesBlogs[i - 1];
          //               newSeriesBlogs[i - 1] = temp;
          //               setSeriesBlogs(newSeriesBlogs);
          //             }
          //           }}
          //         >
          //           Up
          //         </button>
          //         {/* Position DOWN */}
          //         <button
          //           onClick={() => {
          //             if (i < seriesBlogs.length - 1) {
          //               var newSeriesBlogs = seriesBlogs;
          //               var temp = newSeriesBlogs[i];
          //               newSeriesBlogs[i] = newSeriesBlogs[i + 1];
          //               newSeriesBlogs[i + 1] = temp;
          //               setSeriesBlogs(newSeriesBlogs);
          //             }
          //           }}
          //         >
          //           Down
          //         </button>
          //         <div> {seriesBlogs[i].title} </div>
          //         <div> {seriesBlogs[i].description} </div>
          //       </div>
          //     );
          //   }
          //   return blogs;
          // })()
          // seriesBlogs.map((blog) => {
          //   return(
          //     <div key={blog.id}>
          //       {/* Position UP */}
          //       <button onClick={() => {

          //   return <div key={blog.id}> {blog.title} </div>;
          // })
          SeriesBlogsComp(seriesBlogs, series.url)
        )

        // {/* <ul className="series-bar">
        //   {seriesBlogs.length > 0 ? (
        //     seriesBlogs.map((seriesBlog) => {
        //       console.log(seriesBlog["blog"]);
        //       return (
        //         <li key={seriesBlog["blog"]._id}>
        //           {BlogPreview(seriesBlog["blog"], false, "20px", series.url)}
        //         </li>
        //       );
        //     })
        //   ) : (
        //     <div>No Blogs found</div>
        //   )}
        // </ul> */}
      }
    </div>
  );
}
