const express = require("express");
const { register, login, getStudents, getUnAssignedStudents, createOTP, verifyOTP, resetPassword,deleteStudentById, updateUserByID} = require("../controllers/authController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/sendOTP", createOTP);
router.post("/verifyOTP", verifyOTP);
router.post("/resetPassword", resetPassword);
router.delete("/student/delete/:id", authenticate, authorize("admin"), deleteStudentById);
router.put("/student/update/:id",authenticate,updateUserByID)
router.get("/getStudents", authenticate, authorize("admin"), getStudents);
router.get("/getNotAssignedStudents/:courseId", authenticate, authorize("admin"), getUnAssignedStudents);

module.exports = router;