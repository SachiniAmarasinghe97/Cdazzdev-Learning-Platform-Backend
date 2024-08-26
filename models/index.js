// models/index.js
const { Sequelize} = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: "postgres",
  }
);

const User = require("./User")(sequelize, Sequelize.DataTypes);
const Course = require("./course")(sequelize, Sequelize.DataTypes);
const CourseContent = require("./courseContent")(sequelize, Sequelize.DataTypes);
const CourseStudent = require('./courseStudent')(sequelize, Sequelize.DataTypes);


const db = {
  sequelize,
  Sequelize,
  User,
  Course,
  CourseContent,
  CourseStudent,
};

// Create associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
