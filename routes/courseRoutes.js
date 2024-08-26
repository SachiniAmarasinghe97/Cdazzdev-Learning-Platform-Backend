const express = require("express");
const {
  getAllCourses,
  createCourse,
  getCourseByID,
  updateCourseByID,
  deleteCourseByID,
  getAllCoursesForUser
} = require("../controllers/courseController");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const router = express.Router();

router.get("/", authenticate, getAllCourses);
router.get("/user", authenticate, getAllCoursesForUser);
router.post("/", authenticate, authorize(["admin"]), createCourse);
router.get("/:id", authenticate, getCourseByID);
router.put("/:id", authenticate, authorize(["admin"]), updateCourseByID);
router.delete("/:id", authenticate, authorize(["admin"]), deleteCourseByID);

module.exports = router;
