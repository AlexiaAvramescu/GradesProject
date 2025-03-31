const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Subject = sequelize.define('Subject', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
    references: {
      model: 'Teachers', 
      key: 'id',
    },
  },
});

Subject.associate = (models) => {
  Subject.belongsTo(models.Teacher, { foreignKey: 'teacherId', as: 'Teachers' });
  Subject.belongsToMany(models.Student, {
    through: "StudentSubjects", 
    foreignKey: "subjectId",
    otherKey: "studentId"
  });
};


module.exports = Subject;
