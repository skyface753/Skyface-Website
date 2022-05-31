import React from "react";
import { BACKEND_FILES_URL } from "../consts";
import apiService from "../services/api-service";
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
        <button onClick={() =>{
          if(window.confirm("Are you sure you want to delete this file?")){
            
          apiService("admin/files/delete/" + file._id).then(res => {
            if(res.data.success){
              alert("File deleted");
              window.location.reload();
            }else{
              alert("Error deleting file: " + res.data.message);
            }
          });
          }
        }}>Delete</button>
      </div>
    </div>
  );
}
