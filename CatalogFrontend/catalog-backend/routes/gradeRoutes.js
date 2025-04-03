const express = require('express');
const { Student, StudentAssignment  } = require('../models');
const router = express.Router();

router.get('/grades', async (req, res) => {
  try {
    const { assignmentId } = req.query;

    if (!assignmentId) {
      return res.status(400).json({ error: 'Missing assignmentId parameter' });
    }

    const grades = await StudentAssignment.findAll({
      where: { assignmentId },
      attributes: ['studentId', 'assignmentId', 'grade']
    });

    // Ensure plain JSON objects (not Sequelize instances)
    const simplified = grades.map(g => ({
      studentId: g.studentId,
      assignmentId: g.assignmentId,
      grade: g.grade
    }));
    console.log(simplified)
    res.json(simplified);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/grades', async (req, res) => {
  console.log(1)
  try {
    const { assignmentId, studentIds, grade } = req.body;
    console.log(2)
    console.log(assignmentId)
    console.log("\n")
    console.log(studentIds)
    console.log(grade)

    if (!assignmentId || !studentIds || !grade) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Loop through each student and either create or update their grade
    await Promise.all(studentIds.map(async (studentId) => {
      await StudentAssignment.upsert({
        studentId,
        assignmentId,
        grade
      });
    }));

    res.status(200).json({ message: 'Grades added/updated successfully' });
  } catch (error) {
    console.error('Error adding grades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/grades', async (req, res) => {
  try {
    const { assignmentId, studentIds } = req.body;

    if (!assignmentId || !studentIds) {
      return res.status(400).json({ error: 'Missing assignmentId or studentIds' });
    }

    await StudentAssignment.destroy({
      where: {
        assignmentId,
        studentId: studentIds
      }
    });

    res.json({ message: 'Grades deleted successfully' });
  } catch (error) {
    console.error('Error deleting grades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/grades', async (req, res) => {
  try {
    const { assignmentId, studentId, grade } = req.body;
    console.log(assignmentId)
    console.log(studentId)
    console.log(assignmentId)

    if (!assignmentId || !studentId || grade === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find the existing record
    const studentAssignment = await StudentAssignment.findOne({
      where: { assignmentId, studentId }
    });

    if (!studentAssignment) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    // Update the grade
    studentAssignment.grade = grade;
    await studentAssignment.save();

    res.json({ message: 'Grade updated successfully', updatedGrade: studentAssignment });
  } catch (error) {
    console.error('Error updating grade:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
