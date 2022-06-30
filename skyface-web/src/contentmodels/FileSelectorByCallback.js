import { useState, useEffect } from "react";
import { SkyCloudLoader } from "../components/Loader";
import apiService from "../services/api-service";

export default function FileSelectorByCallback({ onSelectCB, onCloseCB }) {
  if (!onSelectCB || !onCloseCB) {
    throw new Error("FileSelectorByID: onSelectCB and onCloseCB are required");
  }
  const [files, setFiles] = useState([]);
  const [filesLoaded, setFilesLoaded] = useState(false);

  useEffect(() => {
    apiService("admin/files").then((res) => {
      if (res.data.success) {
        setFiles(res.data.files);
        setFilesLoaded(true);
      } else {
        alert(res.data.message);
      }
    });
  }, []);
  function refreshFiles() {
    setFilesLoaded(false);
    apiService("admin/files").then((res) => {
      if (res.data.success) {
        setFiles(res.data.files);
        setFilesLoaded(true);
      } else {
        alert(res.data.message);
      }
    });
  }
  return (
    <div id="file-selector-main" className="files-selector-overlay">
      <div className="files-selector-header">
        <h1>Select File</h1>
        <div className="files-selector-close-button" onClick={onCloseCB}>
          Close
          <i className="fas fa-times"></i>
        </div>
        {/* Refresh Button */}
        <div className="files-selector-refresh-button" onClick={refreshFiles}>
          Refresh
          <i className="fas fa-sync-alt"></i>
        </div>
        {/* Upload href */}
        <div className="files-selector-upload-button">
          <a
            href="/admin/file-upload"
            target="_blank"
            rel="noopener noreferrer"
          >
            Upload
            <i className="fas fa-upload"></i>
          </a>
        </div>
      </div>

      <div className="files-selector-body">
        {filesLoaded ? (
          files.length === 0 ? (
            (console.log("No files uploaded yet"),
            (<p>No files uploaded yet</p>))
          ) : (
            (console.log("files: " + files),
            files.map((file) => {
              return (
                <div
                  className="files-selector-file-container"
                  onClick={() => {
                    onSelectCB(file);
                  }}
                >
                  <div className="files-selector-file-name">
                    {file.original_name}
                  </div>
                </div>
              );
            }))
          )
        ) : (
          <SkyCloudLoader />
        )}
      </div>
    </div>
  );
}
