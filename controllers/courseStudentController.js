const { Course, User, CourseStudent } = require("../models/index");

exports.assignStudentsToCourse = async (req, res) => {
  const { courseId, studentId } = req.body;
  try {
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const student = await User.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await CourseStudent.create({
      courseId,
      studentId,
    });
    res
      .status(201)
      .json({ message: "Student assigned to course successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllStudentsForCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: User,
          as: "Students",
          through: { attributes: [] }, // Exclude join table attributes
          attributes: ["id", "username", "role"],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course.Students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeStudentsFromCourse = async (req, res) => {
  const { courseId, userId } = req.body;
  console.log(JSON.stringify(req.body))

  try {
    const course = await Course.findByPk(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await CourseStudent.destroy({
      where: {
        courseId,
        studentId: userId,
      },
    });

    res
      .status(200)
      .json({ message: "Students removed from course successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAssignedCoursesForUser = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findByPk(id, {
      include: [
        {
          model: Course,
          as: "LearningCourses",
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({
        message: "Successfully retrieved assigned courses",
        learningCourses: user.LearningCourses,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollements = await CourseStudent.findAll();
    res.status(200).json(enrollements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
