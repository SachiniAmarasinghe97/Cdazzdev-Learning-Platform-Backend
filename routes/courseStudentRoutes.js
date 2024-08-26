const express = require("express");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const {
  assignStudentsToCourse,
  getAllStudentsForCourse,
  removeStudentsFromCourse,
  getAssignedCoursesForUser,
  getAllEnrollments,
} = require("../controllers/courseStudentController");

const router = express.Router();

router.post("/", authenticate, assignStudentsToCourse);
router.get("/enrollments", authenticate, authorize(["admin"]), getAllEnrollments);
router.get("/getAssignedCourses", authenticate, getAssignedCoursesForUser);
router.post("/remove", authenticate, removeStudentsFromCourse);
router.get("/:courseId", authenticate, authorize(["admin"]), getAllStudentsForCourse);

module.exports = router;
