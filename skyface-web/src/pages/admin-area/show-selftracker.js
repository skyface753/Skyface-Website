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
  //console.log(selfTrackerByPath);

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
