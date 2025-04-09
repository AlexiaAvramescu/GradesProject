const express = require('express');
const router = express.Router();
const { Assignment, Subject, Student, StudentAssignment } = require('../models');

const { Sequelize, Op } = require('sequelize');

router.get('/all-grades', async (req, res) => {
  const { studentId } = req.query;

  try {

    if (!studentId) {
      return res.status(401).json({ error: 'Not logged in.' });
    }

    const records = await StudentAssignment.findAll({
      where: { studentId: studentId },
      include: {
        model: Assignment,
        as: 'Assignment',
        include: {
          model: Subject,
          as: 'Subject',
        }
      },

    });

    if (!records) {
      res.status(404);
    }
    console.log(records);
    res.status(200).json(records);

  } catch (error) {
    console.error('Error fetching all grades:', error);
    res.status(500).json({ error: 'Failed to fetch all grades' });
  }
});


router.get('/subjects', async (req, res) => {
  const { studentId } = req.query;
  console.log("asdfghjkjgfhdgsfadfdgfhghmj");
  if (!studentId) {
    return res.status(401).json({ error: 'Not logged in.' });
  }
  try {
    const records = await StudentAssignment.findAll({
      where: { studentId: studentId }, // Căutăm după student
      include: [
        {
          model: Assignment,
          as: 'Assignment',
          include: [
            {
              model: Subject,
              as: 'Subject',
              attributes: ['id', 'name'], // Includem doar id-ul și numele subiectului
            }
          ]
        }
      ],

    });

    let subjects = {};
    records.forEach(element => {
      if (subjects[element.Assignment.Subject.name])
        subjects[element.Assignment.Subject.name].push(element.grade);
      else {
        subjects[element.Assignment.Subject.name] = [element.grade];
      }
    });

    let averages = {};

    for (let subjectName in subjects) {
      // Sum all grades for the subject
      let sum = subjects[subjectName].reduce((acc, grade) => acc + grade, 0);
      // Calculate the average
      let average = sum / subjects[subjectName].length;
      // Store the average in the averages object
      averages[subjectName] = average;
    }


    //console.log(averages);

    res.status(200).json({averages}); // Returnează subiectele
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});


router.get('/total-average', async (req, res) => {
  const { studentId } = req.query;
  console.log("asdfghjkjgfhdgsfadfdgfhghmj");
  if (!studentId) {
    return res.status(401).json({ error: 'Not logged in.' });
  }
  try {
    const records = await StudentAssignment.findAll({
      where: { studentId: studentId }, // Căutăm după student
      include: [
        {
          model: Assignment,
          as: 'Assignment',
          include: [
            {
              model: Subject,
              as: 'Subject',
              attributes: ['id', 'name'], // Includem doar id-ul și numele subiectului
            }
          ]
        }
      ],

    });

    let subjects = {};
    records.forEach(element => {
      if (subjects[element.Assignment.Subject.name])
        subjects[element.Assignment.Subject.name].push(element.grade);
      else {
        subjects[element.Assignment.Subject.name] = [element.grade];
      }
    });

    let averages = [];

    for (let subjectName in subjects) {
      let sum = subjects[subjectName].reduce((acc, grade) => acc + grade, 0);
      let average = sum / subjects[subjectName].length;
      averages[subjectName] = average;
    }
    
    // Calculăm media totală
    let totalAverages = Object.values(averages).reduce((acc, average) => acc + average, 0);
    totalAverages /= Object.values(averages).length;
    
    console.log(averages);      // Media pentru fiecare subiect
    console.log(totalAverages); 

    res.status(200).json(totalAverages); // Returnează subiectele
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

module.exports = router;