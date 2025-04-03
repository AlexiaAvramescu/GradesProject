const express = require('express');
const { StudentAssignment } = require('../models');
const router = express.Router();

router.get('/grades', async (req, res) => {
  try {
    const { classId } = req.query;

    if (!classId) {
      return res.status(400).json({ error: 'Missing classId parameter' });
    }

    const grades = await StudentAssignment.findAll({
      include: [
        {
          model: Student,
          attributes: ['id', 'name'], // Include student details
          include: {
            model: Subject,
            where: { id: classId }, // Filter by class
            attributes: [], // No need to fetch extra subject details
          }
        },
        {
          model: Assignment,
          attributes: ['id', 'title'] 
        }
      ]
    });

    res.json(grades);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/grades', async (req, res) => {
  try {
    const { assignmentId, studentIds, grade } = req.body;
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
