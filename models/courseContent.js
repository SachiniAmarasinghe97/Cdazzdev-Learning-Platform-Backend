module.exports = (sequelize, DataTypes) => {
  const CourseContent = sequelize.define(
    "CourseContent",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contentUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      urlType: {
        type: DataTypes.ENUM("video", "image", "file", "any"),
        defaultValue: "any",
      },
      contentType: {
        type: DataTypes.ENUM("lesson", "assignment"),
        allowNull: false,
      },
      visibility: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, 
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Courses",
          key: "id",
        },
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isAfter: {
            args: new Date().toISOString(),
            msg: "Start date must be greater than the current date and time",
          },
          isAfterEndDate(value) {
            if (value && this.endDate && value >= this.endDate) {
              throw new Error("Start date must be before end date");
            }
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isAfterStartDate(value) {
            if (value && this.startDate && value <= this.startDate) {
              throw new Error("End date must be greater than start date");
            }
          },
        },
      },
    },
    {
      timestamps: true,
    }
  );

  return CourseContent;
};
