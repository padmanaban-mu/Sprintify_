const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe, searchUsers, updateProfile, updatePassword } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.get("/search", protect, searchUsers);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, updatePassword);

module.exports = router;
