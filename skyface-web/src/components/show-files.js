import React from "react";
import { BACKEND_FILES_URL } from "../consts";
function copyText(text) {
  navigator.clipboard.writeText(text);
}
export default function ShowFilesComponent(file, onClickCB) {
  return (
    <div className="admin-files-list-item" key={file._id}>
      <div
        className="admin-files-list-item-titleandimg"
        onClick={() => onClickCB(file)}
      >
        <img
          src={BACKEND_FILES_URL + file.generated_name}
          alt="file"
          className="admin-files-list-item-img"
        />
        <p className="admin-files-list-item-title">{file.original_name}</p>
      </div>
      <div
        className="admin-files-list-item-generatedName"
        onClick={() => copyText(file.generated_name)}
      >
        <p>{file.generated_name}</p>
      </div>
      <div className="admin-files-list-item-actions">
        <a href={file.generated_name}>Download</a>
        <a
          style={{ marginLeft: "10px" }}
          href={`/admin/delete-file/${file._id}`}
        >
          Delete
        </a>
      </div>
    </div>
  );
}
