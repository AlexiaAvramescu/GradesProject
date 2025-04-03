// models/index.js
const sequelize = require('../db');

const Student = require('./Student');
const Subject = require('./Subject');
const Teacher = require('./Teacher');
const Grade = require('./Grade');
const Assignment = require('./Assignment');
const StudentAssignment = require('./StudentAssignment')
const StudentSubject = require('./StudentSubject');

const models = {
  sequelize,
  Student,
  Subject,
  Teacher,
  Grade,
  Assignment,
  StudentAssignment,
  StudentSubject
};

// Call associate functions
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
