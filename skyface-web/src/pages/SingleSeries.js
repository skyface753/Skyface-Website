import React from "react";
import apiService from "../services/api-service";
import { useParams } from "react-router-dom";
import SeriesBlogsComp from "../components/SeriesBlogsComp";
import { SkyCloudLoader } from "../components/Loader";
import CheckIfAdmin from "../services/CheckIfAdmin";

export default function SingleSeries() {
  var { seriesUrl } = useParams();
  var userIsAdmin = CheckIfAdmin();

  const [series, setSeries] = React.useState(null);
  const [seriesBlogs, setSeriesBlogs] = React.useState(null);
  const [editMode, setEditMode] = React.useState(false);
  const [editSeries, setEditSeries] = React.useState(null);

  React.useEffect(() => {
    apiService("series/" + seriesUrl).then((response) => {
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
      {editMode ? <div>HI</div> : SeriesBlogsComp(seriesBlogs, series.url)}
    </div>
  );
}
