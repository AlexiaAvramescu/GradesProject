// models/StudentAssignment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const StudentAssignment = sequelize.define('StudentAssignment', {
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Students',
      key: 'id'
    }
  },
  assignmentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Assignments',
      key: 'id'
    }
  },
  grade: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
});

StudentAssignment.associate = (models) => {
  StudentAssignment.belongsTo(models.Student, {
    foreignKey: 'studentId',
    as: 'Student'
  });

  StudentAssignment.belongsTo(models.Assignment, {
    foreignKey: 'assignmentId',
    as: 'Assignment'
  });
};


module.exports = StudentAssignment;
