import apiService from "../../services/api-service";
import React from "react";

const defaultSeries = {
  name: "Name for new series",
  description: "Description for new series",
  url: "URL for new series",
};

function checkIfSeriesUrlIsFree(seriesUrl, cbSetError) {
  if (!seriesUrl) {
    cbSetError("Series URL is required");
    return false;
  }
  apiService("admin/series/checkFreeUrl/" + seriesUrl, {}).then((response) => {
    if (response.data.success) {
      cbSetError(null);
    } else {
      cbSetError("Series URL is not free");
    }
  });
}

export default function CreateSeries() {
  const [series, setSeries] = React.useState(defaultSeries);
  const [error, setError] = React.useState(null);
  return (
    <div>
      <h1>{series.name}</h1>
      <p>{series.description}</p>
      <p>{series.url}</p>
      <hr className="blog-divider"></hr>

      <div>
        <input
          type="text"
          placeholder="Name"
          value={series.name}
          onChange={(e) => {
            setSeries({ ...series, name: e.target.value });
          }}
        />
        <input
          type="text"
          placeholder="Description"
          value={series.description}
          onChange={(e) => {
            setSeries({ ...series, description: e.target.value });
          }}
        />
        <input
          type="text"
          placeholder="Url"
          value={series.url}
          onChange={(e) => {
            setSeries({ ...series, url: e.target.value });
            checkIfSeriesUrlIsFree(e.target.value, setError);
          }}
        />
        <p>{error}</p>

        <button
          onClick={() => {
            if (series.name && series.description && series.url) {
              apiService("admin/series/create", { series: series }).then(
                (response) => {
                  if (response.data.success) {
                    alert("Series created");
                  } else {
                    alert(response.data.error);
                  }
                }
              );
            } else {
              alert("Please fill all the fields");
            }
          }}
          {...(error ? { disabled: true } : {})}
        >
          Create
        </button>
      </div>
    </div>
  );
}
