const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Student = require('./Student');
const Subject = require('./Subject');

const StudentSubject = sequelize.define('StudentSubject', {
    student_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Student, 
          key: 'id',      
        },
      },
      subject_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Subject, 
          key: 'id',      
        },
    },
});


module.exports = StudentSubject;
