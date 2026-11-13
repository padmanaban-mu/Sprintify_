const Project = require("../models/Project");

// Get all projects for logged in user
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects", error: err.message });
  }
};

// Create a project
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to create project", error: err.message });
  }
};

// Get single project
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    // Check owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project", error: err.message });
  }
};

// Delete project
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project", error: err.message });
  }
};

module.exports = { getProjects, createProject, getProjectById, deleteProject };
