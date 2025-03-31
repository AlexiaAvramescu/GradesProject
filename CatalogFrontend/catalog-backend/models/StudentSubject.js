const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Student = require('./Student');
const Subject = require('./Subject');

const StudentSubject = sequelize.define('StudentSubject', {
  subjectId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Subjects",
      key: "id"
    }
  },
  studentId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Students",
      key: "id"
    }
  }
});


module.exports = StudentSubject;
