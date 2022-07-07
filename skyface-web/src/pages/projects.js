import React, { useState } from "react";
import apiService from "../services/api-service";
import { SkyCloudLoader } from "../components/Loader";
import ProjectsPreview from "../components/ProjectsPreview";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  React.useEffect(() => {
    apiService("projects").then((res) => {
      if (res.data.success) {
        setProjects(res.data.projects);
      } else {
      }
    });
  }, []);

  if (!projects) return <SkyCloudLoader />;
  return <ProjectsPreview projects={projects} UserIsAdmin={false} />;
}
