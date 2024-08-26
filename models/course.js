// models/course.js

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      imgURL: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  Course.associate = (models) => {
    Course.hasMany(models.CourseContent, {
      onDelete: "CASCADE", // If a course is deleted, delete its associated content
    });

    Course.belongsToMany(models.User, {
      through: "CourseStudent",
      as: "Students",
      foreignKey: "courseId",
      otherKey: "studentId",
    });
  };

  return Course;
};
