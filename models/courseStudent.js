module.exports = (sequelize, DataTypes) => {
  const CourseStudent = sequelize.define(
    "CourseStudent",
    {
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Courses",
          key: "id",
        },
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      timestamps: true,
    }
  );

  return CourseStudent;
};
