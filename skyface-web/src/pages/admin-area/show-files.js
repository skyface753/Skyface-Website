import React from "react";
import apiService from "../../services/api-service";
import { BACKEND_FILES_URL } from "../../consts";
import ShowFilesComponent from "../../components/show-files";
import { SkyCloudLoader } from "../../components/Loader";

export default function ShowFiles() {
  const [files, setFiles] = React.useState(null);
  const [filesLoaded, setFilesLoaded] = React.useState(false);
  React.useEffect(() => {
    apiService("admin/files").then((res) => {
      setFiles(res.data.files);
      setFilesLoaded(true);
    });
  }, []);

  if (!filesLoaded) {
    return <SkyCloudLoader />;
  }

  return (
    <div className="admin-files-container">
      <h1>Files</h1>
      <div
        className="show-upload-lind"
        style={{ position: "absolute", top: "0", right: "0" }}
      >
        <a href="/admin/file-upload">Upload File</a>
      </div>
      <div className="admin-files-list">
        {files.length === 0 ? (
          <p>No files uploaded yet</p>
        ) : (
          files.map((file) => {
            return ShowFilesComponent(file, () => {
              window.open(BACKEND_FILES_URL + file.generated_name);
            });
          })
        )}
      </div>
    </div>
  );
}
