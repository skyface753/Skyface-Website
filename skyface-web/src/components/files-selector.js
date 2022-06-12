import React from "react";
import apiService from "../services/api-service";
import { MeetupLoader, SkyCloudLoader } from "./Loader";
import ShowFilesComponent from "./show-files";

export default function FilesSelector() {
  const [files, setFiles] = React.useState(null);
  const [filesLoaded, setFilesLoaded] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState(null);

  React.useEffect(() => {
    apiService("admin/files").then((res) => {
      setFiles(res.data.files);
      setFilesLoaded(true);
    });
  });

  return (
    <div id="file-selector-main" className="files-selector-overlay">
      <div className="files-selector-header">
        <h1>Select File</h1>
        <div
          className="files-selector-close-button"
          onClick={() => setSelectedFile(null)}
        >
          <i className="fas fa-times"></i>
        </div>
      </div>
      <div className="files-selector-body">
        {filesLoaded ? (
          files.length === 0 ? (
            <p>No files uploaded yet</p>
          ) : (
            files.map((file) => {
              ShowFilesComponent(file, () => {
                setSelectedFile(file);
              });
            })
          )
        ) : (
          <SkyCloudLoader />
        )}
      </div>
    </div>
  );
}
