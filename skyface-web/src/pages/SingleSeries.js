import React from "react";
import apiService from "../services/api-service";
import { useParams } from "react-router-dom";
import BlogPreview from "../components/blog-preview";
import SeriesBlogsComp from "../components/SeriesBlogsComp";

export default function SingleSeries() {
  var { seriesUrl } = useParams();

  const [series, setSeries] = React.useState(null);
  const [seriesBlogs, setSeriesBlogs] = React.useState(null);

  React.useEffect(() => {
    apiService("series/" + seriesUrl).then((response) => {
      console.log(response.data);
      setSeries(response.data["series"]);
      setSeriesBlogs(response.data["seriesBlogs"]);
    });
  }, []);

  if (!series || !seriesBlogs) return <div className="loader" />;

  return (
    <div>
      <div>
        <h1>{series.name}</h1>
        <p>{series.description}</p>
        <hr className="blog-divider"></hr>
      </div>
      {SeriesBlogsComp(seriesBlogs, series.url)}
      {/* <ul className="series-bar">
        {seriesBlogs.length > 0 ? (
          seriesBlogs.map((seriesBlog) => {
            console.log(seriesBlog["blog"]);
            return (
              <li key={seriesBlog["blog"]._id}>
                {BlogPreview(seriesBlog["blog"], false, "20px", series.url)}
              </li>
            );
          })
        ) : (
          <div>No Blogs found</div>
        )}
      </ul> */}
    </div>
  );
}
