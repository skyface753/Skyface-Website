const ProjectModel = require("../models/project_model");

const ProjectService = {
  getProjects: async (req, res) => {
    try {
      const projects = await ProjectModel.find();
      res.json({
        success: true,
        projects,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  last3Projects: async (req, res) => {
    try {
      const projects = await ProjectModel.find().limit(3);
      res.json({
        success: true,
        projects,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getProjectByID: async (req, res) => {
    try {
      const project = await ProjectModel.findById(req.params.projectID);
      res.json({
        success: true,
        project,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  createProject: async (req, res) => {
    const title = req.body.title;
    const links = req.body.links;
    const text = req.body.text;
    const project = new ProjectModel({
      title,
      links,
      text,
    });
    try {
      await project.save();
      res.json({
        success: true,
        project,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateProject: async (req, res) => {
    const title = req.body.title;
    const links = req.body.links;
    const text = req.body.text;
    try {
      const project = await ProjectModel.findByIdAndUpdate(
        req.params.projectID,
        {
          title,
          links,
          text,
        },
        { new: true }
      );
      res.json({
        success: true,
        project,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  deleteProject: async (req, res) => {
    try {
      await ProjectModel.findByIdAndDelete(req.params.projectID);
      res.json({
        success: true,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = ProjectService;
