const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Assignment = sequelize.define('Assignment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  subjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Subjects',
      key: 'id'
    }
  }
});

Assignment.associate = (models) => {
  Assignment.belongsTo(models.Subject, {
    foreignKey: 'subjectId',
    as: 'Subject'
  });
  
  Assignment.belongsToMany(models.Student, {
    through: models.StudentAssignment,
    foreignKey: 'assignmentId',
    otherKey: 'studentId',
    as: 'GradedStudents'
  });
};

module.exports = Assignment;
