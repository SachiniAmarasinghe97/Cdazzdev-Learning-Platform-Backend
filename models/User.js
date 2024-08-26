// models/user.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      telephoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("student", "admin"),
        defaultValue: "student",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otpExpiration: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  );

  User.associate = (models) => {

    User.belongsToMany(models.Course, {
      through: models.CourseStudent,
      as: "LearningCourses",
      foreignKey: "studentId",
      otherKey: "courseId",
    });

  };

  return User;
};
