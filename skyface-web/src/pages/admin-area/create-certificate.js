import React from "react";
import FileSelectorByCallback from "../../contentmodels/FileSelectorByCallback";
import apiService from "../../services/api-service";

const CreateCertificateSite = () => {
  const [cert, setCert] = React.useState({
    title: "",
    description: "",
    file_path: "",
  });

  const [selectFile, setSelectFile] = React.useState(false);

  return (
    <div>
      <h1>Create Certificate</h1>
      <form
        onSubmit={(e) => {
          apiService("admin/certificates/create", cert).then((res) => {
            try {
              if (res.data.success) {
                alert("Certificate created");
                setCert({
                  title: "",
                  description: "",
                  file_path: "",
                });
              }
            } catch (err) {
              alert("Something went wrong");
            }
          });
          e.preventDefault();
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={cert.title}
          onChange={(e) => {
            setCert({
              ...cert,
              title: e.target.value,
            });
          }}
        />
        <input
          type="text"
          placeholder="Description"
          value={cert.description}
          onChange={(e) => {
            setCert({
              ...cert,
              description: e.target.value,
            });
          }}
        />
        {/* Toggle Button fileSelect bool */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setSelectFile(!selectFile);
          }}
        >
          {" "}
          Select File{" "}
        </button>
        {selectFile ? (
          <FileSelectorByCallback
            onCloseCB={() => {
              setSelectFile(false);
            }}
            onSelectCB={(file) => {
              setCert({
                ...cert,
                file_path: file.generated_name,
              });
              setSelectFile(false);
            }}
          />
        ) : cert.file_path ? (
          cert.file_path
        ) : (
          "No File selected"
        )}
        {/* <input
          type="text"
          placeholder="Image"
          value={cert.file_path}
          onChange={(e) => {
            setCert({
              ...cert,
              file_path: e.target.value,
            });
          }}
        /> */}
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateCertificateSite;
