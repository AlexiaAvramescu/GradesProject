const express = require('express');
const { StudentAssignment } = require('../models');
const router = express.Router();

router.post('/grades', async (req, res) => {
  try {
    const { assignmentId, studentIds, grade } = req.body;

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

    res.json({ message: 'Grades added/updated successfully' });
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

module.exports = router;


module.exports = router;
