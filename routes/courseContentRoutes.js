const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

const {
  createCourseContent, getAllCourseContents,getCourseContentById, updateCourseContent,deleteCourseContent, updateVisibility, getContentsByCourseId
} = require("../controllers/courseContentController");

router.post("/", authenticate, authorize([ "admin"]), createCourseContent);
router.get("/", authenticate, authorize(["admin"]), getAllCourseContents);
router.get("/course/:courseId/content/:id", authenticate, getCourseContentById);
router.get("/course/:courseId", authenticate,getContentsByCourseId);
router.put("/:id", authenticate, authorize(["admin"]), updateCourseContent);
router.delete("/:id", authenticate, authorize(["admin"]), deleteCourseContent);
router.post("/visibility/", authenticate, authorize(["admin"]), updateVisibility);

module.exports = router;
