const Task = require("../models/Task");
const Project = require("../models/Project");

// GET /api/tasks?projectId=XYZ
const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ message: "projectId is required" });

    // Verify project access
    const project = await Project.findById(projectId);
    if (!project || project.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized for this project" });
    }

    const tasks = await Task.find({ project: projectId })
      .populate("assignee", "name email")
      .sort({ order: 1, createdAt: -1 });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
};

// GET /api/tasks/upcoming
const getUpcomingTasks = async (req, res) => {
  try {
    // Find projects owned by user
    const projects = await Project.find({ owner: req.user._id });
    const projectIds = projects.map(p => p._id);

    // Get tasks assigned to user OR in user's projects that have a due date in the future, not Done
    const tasks = await Task.find({
      project: { $in: projectIds },
      dueDate: { $gte: new Date() },
      status: { $ne: "Done" }
    })
      .populate("project", "name")
      .sort({ dueDate: 1 })
      .limit(5);

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch upcoming tasks", error: err.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, tag, dueDate, assignee, projectId } = req.body;

    if (!title || !title.trim() || !projectId) {
      return res.status(400).json({ message: "Title and projectId are required" });
    }

    const project = await Project.findById(projectId);
    if (!project || project.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized for this project" });
    }

    const lastTask = await Task.findOne({ project: projectId, status: status || "Backlog" }).sort({ order: -1 });
    const newOrder = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      tag,
      dueDate,
      assignee: assignee || null,
      project: projectId,
      order: newOrder,
    });

    const populatedTask = await Task.findById(task._id).populate("assignee", "name email");
    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", error: err.message });
  }
};

// PUT /api/tasks/reorder
const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!Array.isArray(tasks)) return res.status(400).json({ message: "Invalid payload" });

    const bulkOps = tasks.map((task) => ({
      updateOne: {
        filter: { _id: task._id },
        update: { status: task.status, order: task.order },
      },
    }));

    if (bulkOps.length > 0) {
      await Task.bulkWrite(bulkOps);
    }
    res.status(200).json({ message: "Tasks reordered" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reorder", error: err.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task = await Task.findByIdAndUpdate(
      req.params.id, 
      {...req.body, assignee: req.body.assignee || null}, 
      { new: true }
    ).populate("assignee", "name email");
    
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", error: err.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted", _id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err.message });
  }
};

module.exports = { getTasks, getUpcomingTasks, createTask, updateTask, deleteTask, reorderTasks };
