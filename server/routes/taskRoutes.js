const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getTasks,
  getUpcomingTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} = require("../controllers/taskController");

router.route("/").get(protect, getTasks).post(protect, createTask);
router.route("/upcoming").get(protect, getUpcomingTasks);
router.route("/reorder").put(protect, reorderTasks);
router.route("/:id").put(protect, updateTask).delete(protect, deleteTask);

module.exports = router;
