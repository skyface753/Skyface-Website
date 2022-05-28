import apiService from "../services/api-service";
import React from "react";

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
        console.log(response.data);
        alert(response.data);
      }
    });
  }, []);

  if (!series) return <div className="loader" />;

  return (
    <div>
      {series.map((series) => {
        return (
          <div
            key={series._id}
            onClick={() => gotoSeries(series.url)}
            className="series-preview"
          >
            <h1>{series.name}</h1>
            <p>{series.description}</p>
            <p>{series.url}</p>
            <hr className="blog-divider"></hr>
          </div>
        );
      })}
    </div>
  );
}
