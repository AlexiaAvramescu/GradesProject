const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Student = require('./Student');
const Subject = require('./Subject');

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  grade: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
  },
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


module.exports = Grade;
