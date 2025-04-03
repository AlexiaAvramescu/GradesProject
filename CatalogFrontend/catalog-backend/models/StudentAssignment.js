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

module.exports = StudentAssignment;
