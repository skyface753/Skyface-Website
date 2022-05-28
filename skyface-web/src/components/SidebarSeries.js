import React from "react";
import SeriesBlogsComp from "./SeriesBlogsComp";
import apiService from "../services/api-service";

const SidebarSeries = (seriesUrl) => {
  /*{
    "seriesUrl": "rn-app-getting-started"
}*/
  seriesUrl = seriesUrl.seriesUrl;
  const [series, setSeries] = React.useState(null);
  const [seriesBlogs, setSeriesBlogs] = React.useState(null);

  React.useEffect(() => {
    apiService("series/" + seriesUrl).then((response) => {
      console.log("response.data for seriesUrl");
      console.log(seriesUrl);
      console.log(response.data);
      setSeries(response.data["series"]);
      setSeriesBlogs(response.data["seriesBlogs"]);
    });
  });

  if (!series || !seriesBlogs) return <div className="loader" />;

  return (
    <div>
      <div>
        <h1>{series.name}</h1>
      </div>
      {SeriesBlogsComp(seriesBlogs, series.url)}
    </div>
  );
};

export default SidebarSeries;
