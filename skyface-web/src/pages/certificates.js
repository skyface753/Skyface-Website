import React from "react";
import apiService from "../services/api-service";
import { SkyCloudLoader } from "../components/Loader";
import { BACKEND_FILES_URL } from "../consts";
import CheckIfAdmin from "../services/CheckIfAdmin";
import { useParams } from "react-router-dom";

const CertificatesSite = () => {
  const [certificates, setCertificates] = React.useState(null);
  const certId = useParams().id;

  React.useEffect(() => {
    apiService("certificates/get").then((res) => {
      if (res.data.success) {
        setCertificates(res.data.certificates);
      }
    });
  }, []);

  if (!certificates) {
    return <SkyCloudLoader />;
  }

  const isAdmin = CheckIfAdmin();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        color: "white",
        // backgroundColor: "black",
      }}
    >
      <h1>Certificates</h1>
      {certId ? (
        <CertificateComponent
          certificate={certificates.find((cert) => cert._id === certId)}
          isAdmin={isAdmin}
          setCertificates={setCertificates}
        />
      ) : (
        certificates.map((certificate) => (
          <CertificateComponent
            certificate={certificate}
            isAdmin={isAdmin}
            setCertificates={setCertificates}
            key={certificate._id}
          />
        ))
      )}
    </div>
  );

  // <tr key={certificate._id} style={{ border: "1px solid black" }}>
  //   <td>{certificate.title}</td>
  //   <td>{certificate.description}</td>
  //   <td>
  //     {certificate.file_path ? (
  //       fileType === "pdf" ? (
  //         />
  //       ) : (
  //         <img
  //           src={`${BACKEND_FILES_URL}${certificate.file_path}`}
  //           alt="certificate"
  //           style={{
  //             width: "50px",
  //             height: "50px",
  //             borderRadius: "50%",
  //           }}
  //         />
  //       )
  //     ) : null}

  //     {/* <img
  //         src={BACKEND_FILES_URL + certificate.file_path}
  //         alt="certificate"
  //         style={{
  //           width: "50px",
  //           height: "50px",
  //           borderRadius: "50%",
  //         }}
  //       />
  //     ) : null} */}
  //   </td>
  //   {isAdmin ? (
  //     <td>
  //       <button
  //         onClick={() => {
  //           apiService(`certificates/delete/${certificate._id}`)
  //             .then((res) => {
  //               if (res.data.success) {
  //                 setCertificates(res.data.certificates);
  //               }
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //             });
  //         }}
  //       >
  //         Delete
  //       </button>
  //     </td>
  //   ) : null}
  // </tr>
  //   );
  //     })}
  // </tbody>
  //   </table>
  // </div>
  //   );
};

const CertificateComponent = ({ certificate, isAdmin, setCertificates }) => {
  //Check if file is an image or pdf
  let fileType;
  try {
    fileType = certificate.file_path.split(".").pop();
  } catch (err) {
    console.log(err);
  }

  return (
    <div
      key={certificate._id}
      className="certificate-container"
      id={certificate._id}
    >
      <h2>{certificate.title}</h2>
      <p>{certificate.description}</p>
      {fileType === "pdf" ? (
        <embed
          src={`${BACKEND_FILES_URL}${certificate.file_path}`}
          type="application/pdf"
          width="100%"
          height="600px"
          style={{
            border: "1px solid black",
            display: "block",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
        />
      ) : (
        <img
          src={`${BACKEND_FILES_URL}${certificate.file_path}`}
          alt={certificate.title}
        />
      )}
      {isAdmin && (
        <button
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to delete this certificate?"
              )
            ) {
              apiService(`admin/certificates/delete/${certificate._id}`)
                .then((res) => {
                  if (res.data.success) {
                    alert("Certificate deleted");
                    setCertificates(res.data.remainingCertificates);
                  }
                })
                .catch((err) => {
                  alert("Something went wrong");
                });
            }
          }}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default CertificatesSite;
