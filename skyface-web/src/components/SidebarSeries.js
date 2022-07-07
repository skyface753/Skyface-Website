import React from "react";
import SeriesBlogsComp from "./SeriesBlogsComp";
import apiService from "../services/api-service";
import { SkyCloudLoader } from "./Loader";

const SidebarSeries = (seriesUrl) => {
  seriesUrl = seriesUrl.seriesUrl;
  const [series, setSeries] = React.useState(null);
  const [seriesBlogs, setSeriesBlogs] = React.useState(null);

  React.useEffect(() => {
    apiService("series/" + seriesUrl).then((response) => {
      //console.log("response.data for seriesUrl");
      //console.log(seriesUrl);
      //console.log(response.data);
      setSeries(response.data["series"]);
      setSeriesBlogs(response.data["seriesBlogs"]);
    });
  });

  if (!series || !seriesBlogs) return <SkyCloudLoader />;

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
