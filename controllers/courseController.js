const {Course, User} = require("../models/index");
const { sequelize } = require('../models');
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCourse = async (req, res) => {
  const { title, description, imgURL, courseID } = req.body;
  try {
    const course = await Course.create({ title, description, imgURL, courseID});
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get course by id
exports.getCourseByID = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);   
  } catch {
    res.status(500).json({ error: error.message });
  }
};

// update course
exports.updateCourseByID = async (req, res) => {
  const { id } = req.params;
  const { title, description, imgURL, courseID } = req.body;
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const updatedFields = {
      ...(title && { title }),
      ...(description && { description }),
      ...(imgURL && {imgURL}),
      ...(courseID && {courseID}),
    }
    await course.update(updatedFields);
    res.status(200).json(course);
  } catch {
    res.status(500).json({ error: error.message });
  }
};

// delete course
exports.deleteCourseByID = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    await course.destroy();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};

// get all courses for user
exports.getAllCoursesForUser = async (req, res) => {
  try {
    const { id } = req.user; // Logged-in user's ID

    // Retrieve all courses along with the isEnroll status
    const courses = await Course.findAll({
      attributes: ['id', 'title', 'description', 'imgURL'],
      include: [
        {
          model: User, // Include the User model (students)
          as: 'Students', // Use the alias defined in the association
          attributes: ['id'], // Only fetch User ID
          through: {
            attributes: [], // Exclude attributes from the join table
          },
          where: { id }, // Only include the logged-in user
          required: false, // Allow courses without this user to still be returned
        },
      ],
    });

    // Add isEnroll to each course
    const coursesWithEnrollStatus = courses.map(course => {
      const isEnroll = course.Students.some(student => student.id === id);
      return {
        ...course.toJSON(),
        isEnroll,
      };
    });

    res.status(200).json({
      success: true,
      data: coursesWithEnrollStatus,
    });
  } catch (error) {
    console.error('Error retrieving courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve courses',
    });
  }
};



