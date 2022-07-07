import React from "react";
import apiService from "../../services/api-service";

export default function FileUpload() {
  const [image, setImage] = React.useState({ preview: "", data: "" });
  const [status, setStatus] = React.useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", image.data);
    apiService("admin/upload", formData).then((res) => {
      //console.log("res: ", res);
      setStatus(res.data.message);
      if (res.data.success) {
        alert("File uploaded successfully");
        setImage({ preview: "", data: "" });
        window.location.reload();
      }
    });
  };

  const handleFileChange = (e) => {
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
  };

  return (
    <div className="App">
      <h1>Upload to server</h1>
      {image.preview && (
        <img src={image.preview} alt="preview" width="100" height="100" />
      )}
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" onChange={handleFileChange}></input>
        <button type="submit">Submit</button>
      </form>
      {status && <h4>{status}</h4>}
    </div>
  );
}
