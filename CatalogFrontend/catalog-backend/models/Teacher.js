const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Teacher = sequelize.define('Teacher', {
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

Teacher.associate = (models) => {
  Teacher.hasMany(models.Subject, { foreignKey: "teacherId", as: "Subjects" });
}


module.exports = Teacher;
