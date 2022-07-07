import apiService from "../services/api-service";
import React from "react";
import { SkyCloudLoader } from "../components/Loader";

function gotoSeries(url) {
  window.location.href = `/series/${url}`;
}

export default function SeriesPage() {
  const [series, setSeries] = React.useState(null);

  React.useEffect(() => {
    apiService("series", {}).then((response) => {
      if (response.data.success) {
        setSeries(response.data.series);
      } else {
        alert(response.data);
      }
    });
  }, []);

  if (!series) return <SkyCloudLoader />;

  return (
    <div>
      <h1>Series</h1>
      <hr className="blog-divider"></hr>
      {series.map((series) => {
        return (
          <div
            key={series._id}
            onClick={() => gotoSeries(series.url)}
            className="series-preview"
          >
            <h2>{series.name}</h2>
            <p>{series.description}</p>
            <hr className="blog-divider"></hr>
          </div>
        );
      })}
    </div>
  );
}
