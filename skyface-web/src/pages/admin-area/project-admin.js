/*{
    title: '',
    links: [],
    text: ''
}*/

import React, { useState } from "react";
import { SkyCloudLoader } from "../../components/Loader";
import apiService from "../../services/api-service";
import { useParams } from "react-router-dom";
var emptyProject = {
  title: "",
  links: [
    {
      text: "",
      href: "",
    },
  ],
  text: "",
};

export default function ProjectAdminPage({}) {
  const [project, setProject] = useState(emptyProject);
  const existingProjectID = useParams().projectID;

  React.useEffect(() => {
    if (existingProjectID) {
      apiService("projects/" + existingProjectID).then((res) => {
        if (res.data.success) {
          setProject(res.data.project);
        }
      });
    }
  }, [existingProjectID]);

  if (existingProjectID && !project) return <SkyCloudLoader />;

  return (
    <div>
      {existingProjectID ? (
        <h1>Edit project</h1>
      ) : (
        <h1>Create a new project</h1>
      )}

      <label>Title</label>
      <input
        type="text"
        value={project.title}
        onChange={(e) => {
          setProject({ ...project, title: e.target.value });
        }}
      />
      <label>Links</label>
      {project.links.map((link, index) => {
        return (
          <div key={index}>
            <label
              style={{
                float: "left",
              }}
            >
              Link {index + 1}
            </label>
            <input
              type="text"
              value={link.text}
              onChange={(e) => {
                project.links[index].text = e.target.value;
                setProject({ ...project });
              }}
            />
            <input
              type="text"
              value={link.href}
              onChange={(e) => {
                project.links[index].href = e.target.value;
                setProject({ ...project });
              }}
            />
            <button
              onClick={() => {
                setProject({
                  ...project,
                  links: project.links.filter((l, i) => i !== index),
                });
              }}
            >
              Remove
            </button>
          </div>
        );
      })}

      <button
        onClick={() => {
          project.links.push({
            text: "",
            href: "",
          });
          setProject({ ...project });
        }}
      >
        Add Link
      </button>

      <label>Text</label>
      <input
        type="text"
        value={project.text}
        onChange={(e) => {
          setProject({ ...project, text: e.target.value });
        }}
      />
      <button
        type="submit"
        onClick={() => {
          // Check if project is valid and send to server
          if (project.title && project.text) {
            //console.log("Project is valid");
          } else {
            alert("Project is not valid");
            return;
          }
          var linksAreValid = true;
          for (var i = 0; i < project.links.length; i++) {
            if (!project.links[i].text || !project.links[i].href) {
              linksAreValid = false;
            }
          }
          if (linksAreValid) {
            //console.log("Links are valid");
            if (existingProjectID) {
              apiService(
                "admin/projects/update/" + existingProjectID,
                project
              ).then((res) => {
                if (res.data.success) {
                  alert("Project updated");
                  window.location.href = "/projects";
                } else {
                  alert(res.data.message);
                }
              });
            } else {
              apiService("admin/projects/create", project).then((res) => {
                if (res.data.success) {
                  alert("Project created successfully");
                  window.location.href = "/projects/";
                } else {
                  //console.log(res.data.message);
                }
              });
            }
          } else {
            alert("Links are not valid");
          }
        }}
      >
        Submit
      </button>
    </div>
  );
}
