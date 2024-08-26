const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateOTP= require("../utils/generateOTP");
const resetPassword = require("../utils/resetPassword");
const {User, CourseStudent} = require("../models/index");
const generateToken = require("../utils/generateToken");
const { Op, where } = require("sequelize");
const config = require("../config/config");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  const { username, firstName, lastName, telephoneNumber, password, role, email} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      firstName,
      lastName,
      telephoneNumber,
      password: hashedPassword,
      role,
      email,
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// get only students
exports.getStudents = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "student" },
      attributes: ["id", "username", "firstName", "lastName", "email"],
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "Students not found" });
    }
    res.status(200).json({ message: "Successfully get students", data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// get assigned and not assigned students
exports.getUnAssignedStudents = async (req, res) => {
  const courseId = req.params.courseId;
  try {
    const allAssignedStudents = await CourseStudent.findAll({
      where: { courseId },
      attributes: ['studentId']
    });

    let allAssignedStudentIds = [];
    if (allAssignedStudents && allAssignedStudents.length > 0) {
      allAssignedStudentIds = allAssignedStudents.map((st) => st.studentId);
    }

    let unassignedStudents = [];
    if (allAssignedStudentIds.length >= 0) {
      unassignedStudents = await User.findAll({
        where: {
          role: 'student',
          id: {
            [Op.notIn]: allAssignedStudentIds
          }
        },
        attributes: ['id', 'username', 'role']
      });
    }

    let assignedStudents = [];
    if (allAssignedStudentIds.length > 0) {
      assignedStudents = await User.findAll({
        where: {
          role: 'student',
          id: {
            [Op.in]: allAssignedStudentIds
          }
        },
        attributes: ['id', 'username', 'role']
      });
    }

    res.status(200).json({
      message: "Successfully retrieved assigned and unassigned students",
      unassignedStudents: unassignedStudents,
      assignedStudents: assignedStudents,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// create OTP for forget password
exports.createOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otpForUser = generateOTP(user);
    await otpForUser.save();

    const transporter = nodemailer.createTransport({
      service: config.development.email_service,
      auth: {
        user: config.development.email_user,
        pass: config.development.gmail_app_password,
      },
    });

    // console.log(
    //   `Hi ${config.development.email_service} config.development.email_user config.development.gmail_app_password`
    // );

    const mailOptions = {
      to: email,
      from: config.development.email_user,
      subject: "Cdazzdev Learning Platform Password Reset OTP",
      html: `<p>Your OTP for password reset is: <strong>${otpForUser.otp}</strong></p>
             <p>This will be expired in 1 hour.</p>`,
    };

    transporter
      .sendMail(mailOptions)
      .then((info) => {
        return res.status(201).json({
          msg: "Email sent",
          info: info.messageId,
          preview: nodemailer.getTestMessageUrl(info),
        });
      })
      .catch((err) => {
        return res.status(500).json({ msg: err });
      });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email,
        otp,
        otpExpiration: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified", userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  try {
    const user = await User.findOne({
      where: {
        id: userId,
        otpExpiration: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found or OTP expired" });
    }

    const resetUser = resetPassword(newPassword, user);
    await resetUser.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// delete student by id
exports.deleteStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserByID = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, telephoneNumber, email } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const updatedFields = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(telephoneNumber && {telephoneNumber}),
      ...(email && {email}),
      
    }
    await user.update(updatedFields);
    res.status(200).json(user);
  } catch {
    res.status(500).json({ error: error.message });
  }
};

