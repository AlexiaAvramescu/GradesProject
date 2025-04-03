const { DataTypes } = require('sequelize');
const sequelize = require('../db');


const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

Student.associate = models => {
  Student.belongsToMany(models.Subject, {
    through: "StudentSubjects",
    foreignKey: "studentId",
    otherKey: "subjectId"
  });
  Student.belongsToMany(models.Assignment, {
    through: models.StudentAssignment,
    foreignKey: 'studentId',
    otherKey: 'assignmentId',
    as: 'GradedAssignments'
  });
};

module.exports = Student;
