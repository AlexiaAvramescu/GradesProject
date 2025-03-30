const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Teacher = require('./Teacher');
const Subject = require('./Subject');

const TeacherSubject = sequelize.define('TeacherSubject', {
    teacher_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Teacher, 
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


module.exports = TeacherSubject;
