// courseContentController.js
const { where } = require("sequelize");
const { CourseContent, Sequelize } = require("../models/index");
const { Op } = Sequelize; // Import the Op object from Sequelize

exports.createCourseContent = async (req, res) => {
  const {
    title,
    description,
    contentUrl,
    urlType,
    contentType,
    visibility,
    startDate,
    endDate,
    courseId,
  } = req.body;

  try {
    const courseContent = await CourseContent.create({
      title,
      description,
      contentUrl,
      urlType,
      contentType,
      visibility,
      startDate,
      endDate,
      courseId,
    });
    res
      .status(201)
      .json({ message: "Course content created successfully", courseContent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all course contents
exports.getAllCourseContents = async (req, res) => {
  try {
    const courseContents = await CourseContent.findAll();
    res.status(200).json(courseContents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get course content by id
exports.getCourseContentById = async (req, res) => {
  const { id } = req.params;
  try {
    const courseContent = await CourseContent.findByPk(id);
    if (!courseContent) {
      return res.status(404).json({ message: "Course content not found" });
    }
    res.status(200).json(courseContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update course content
exports.updateCourseContent = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    contentUrl,
    urlType,
    contentType,
    visibility,
    startDate,
    endDate,
    courseId,
  } = req.body;
  try {
    const courseContent = await CourseContent.findByPk(id);
    if (!courseContent) {
      return res.status(404).json({ message: "Course content not found" });
    }
    // Update only the fields provided in the request body
    const updatedFields = {
      ...(title && { title }),
      ...(description && { description }),
      ...(contentUrl && { contentUrl }),
      ...(urlType && { urlType }),
      ...(contentType && { contentType }),
      ...(visibility !== undefined && { visibility }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(courseId && { courseId }),
    };
    await courseContent.update(updatedFields);
    res
      .status(200)
      .json({ message: "Course content updated successfully", courseContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete course content
exports.deleteCourseContent = async (req, res) => {
  const { id } = req.params;
  try {
    const courseContent = await CourseContent.findByPk(id);
    if (!courseContent) {
      return res.status(404).json({ message: "Course content not found" });
    }
    await courseContent.destroy();
    res.status(200).json({ message: "Course content deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateVisibility = async () => {
  try {
    // Get the current date and time
    const now = new Date();

    // Update course contents where endDate is less than the current date and time
    const result = await CourseContent.update(
      { visibility: false }, // Set visibility to false
      {
        where: {
          endDate: {
            [Op.lt]: now // endDate less than current date and time
          },
          visibility: true // Only update if currently visible
        }
      }
    );

    console.log(`Updated ${result[0]} course contents to set visibility to false.`);
  } catch (error) {
    console.error('Error updating visibility for course contents:', error);
  }
};

// get by courseId
exports.getContentsByCourseId = async (req, res) => {
  const { courseId } = req.params;
  try {
    const courseContents = await CourseContent.findAll({
      where: {
        courseId :courseId,
      },
    });
    if (!courseContents) {
      return res.status(404).json({ message: "Course content not found" });
    }
    res.status(200).json({ message: "successfully get contents" , data: courseContents});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};