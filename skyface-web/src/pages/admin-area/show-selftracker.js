import { useEffect, useState } from "react";
import { SkyCloudLoader } from "../../components/Loader";
import apiService from "../../services/api-service";
import { PieChart } from "react-minimal-pie-chart";

export default function ShowSelfTracker() {
  const [selfTrackerBySignature, setSelfTrackerBySignature] = useState(null);
  const [selfTrackerByPath, setSelfTrackerByPath] = useState(null);

  useEffect(() => {
    apiService("admin/self-tracker/get").then((res) => {
      setSelfTrackerBySignature(res.data.selfTrackerBySignature); //_id = signature
      setSelfTrackerByPath(res.data.selfTrackerByPath); //_id = path
    });
  }, []);
  //console.log(selfTrackerByPath);
  var pieDataSignature = [];
  var maxSignatureCount = 0;
  if (selfTrackerBySignature) {
    selfTrackerBySignature.forEach((element) => {
      pieDataSignature.push({
        title: element._id,
        value: element.count,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
      maxSignatureCount += element.count;
    });
  }
  var pieDataPath = [];
  var maxPathCount = 0;
  if (selfTrackerByPath) {
    selfTrackerByPath.forEach((element) => {
      pieDataPath.push({
        title: element._id,
        value: element.count,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
      maxPathCount += element.count;
    });
  }
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
      {pieDataSignature.length > 0 ? (
        <PieChart
          data={pieDataSignature}
          onClick={(event, dataIndex) => {
            console.log(dataIndex);
          }}
          totalValue={maxSignatureCount}
        />
      ) : (
        <SkyCloudLoader />
      )}
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
      {pieDataPath.length > 0 ? (
        <PieChart data={pieDataPath} totalValue={maxPathCount} />
      ) : (
        <SkyCloudLoader />
      )}
    </div>
  );
}
