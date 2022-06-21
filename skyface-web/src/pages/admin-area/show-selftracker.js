import { useEffect, useState } from "react";
import { SkyCloudLoader } from "../../components/Loader";
import apiService from "../../services/api-service";

export default function ShowSelfTracker() {
  const [selfTrackerBySignature, setSelfTrackerBySignature] = useState(null);
  const [selfTrackerByPath, setSelfTrackerByPath] = useState(null);

  useEffect(() => {
    apiService("admin/self-tracker/get").then((res) => {
      setSelfTrackerBySignature(res.data.selfTrackerBySignature);
      setSelfTrackerByPath(res.data.selfTrackerByPath);
    });
  }, []);
  console.log(selfTrackerByPath);
  /*[[
    {
        "_id": "/login",
        "count": 4
    },
    {
        "_id": "/blogs",
        "count": 8
    },
    {
        "_id": "/Categories",
        "count": 2
    },
    {
        "_id": "/",
        "count": 13
    },
    {
        "_id": "/admin",
        "count": 2
    },
    {
        "_id": "/admin/show-selftracker",
        "count": 4
    },
    {
        "_id": "/api/self-tracker",
        "count": 2
    }
]*/
  return (
    <div>
      <h1>ShowSelfTracker</h1>
      <h2>selfTrackerBySignature</h2>
      <ul>
        {selfTrackerBySignature ? (
          selfTrackerBySignature.map((item) => (
            <li key={item._id}>
              {item._id} {item.count}
            </li>
          ))
        ) : (
          <SkyCloudLoader />
        )}
      </ul>
      <h2>selfTrackerByPath</h2>
      <ul>
        {selfTrackerByPath ? (
          selfTrackerByPath.map((item) => (
            <li key={item._id}>
              {item._id} {item.count}
            </li>
          ))
        ) : (
          <SkyCloudLoader />
        )}
      </ul>
    </div>
  );
}
