// app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const {sequelize} = require("./models/index");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const courseContentRoutes = require("./routes/courseContentRoutes");
const courseStudentRoutes = require("./routes/courseStudentRoutes");


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/course-content", courseContentRoutes);
app.use("/api/v1/course-students", courseStudentRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    // Ensure models are synchronized with the database
    await sequelize.sync({ alter: true }); // Update tables to match models without dropping
    console.log("Models synchronized!");
  } catch (error) {
    console.log("Unable to connect to the database:", error);
  }
});
