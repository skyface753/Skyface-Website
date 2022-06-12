import React from "react";
import apiService from "../services/api-service";
import { MeetupLoader, SkyCloudLoader } from "./Loader";

export const SeriesSelect = ({ selectedSeries, onChange }) => {
  const [series, setSeries] = React.useState(null);
  React.useEffect(() => {
    apiService("series").then((response) => {
      if (response.data.success) {
        setSeries(response.data.series);
      }
    });
  }, []);

  if (!series) return <SkyCloudLoader />;

  return (
    <div>
      <fieldset>
        <input
          type="radio"
          name="series"
          value=""
          checked={!selectedSeries}
          onChange={() => {
            onChange(null);
          }}
        />
        {series.map((series) => {
          return (
            <div key={series._id}>
              <input
                type="radio"
                name="series"
                value={series._id}
                checked={selectedSeries === series._id}
                onChange={() => onChange(series._id)}
              />
              <label>{series.name}</label>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
};
