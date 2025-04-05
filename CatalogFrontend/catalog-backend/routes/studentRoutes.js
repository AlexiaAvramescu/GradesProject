const express = require('express');
const router = express.Router();
const { Assignment, Grade, Subject, Student, StudentAssignment } = require('../models');

// GET /student/:studentId/classes/:classId/assignments
router.get('/:studentId/classes/:classId/assignments', async (req, res) => {
  try {
    const { studentId, classId } = req.params;

    // Ensure student is enrolled in classId
    const subject = await Subject.findOne({
      where: { id: classId },
      include: [
        {
          model: Student,
          where: { id: studentId },
          required: true
        }
      ]
    });
    if (!subject) {
      return res.status(403).json({ error: 'You are not enrolled in this class.' });
    }

    // Then fetch that class’s assignments
    const assignments = await Assignment.findAll({
      where: { subjectId: classId },
      include: [
        {
          model: Grade,
          where: { studentId },
          required: false
        }
      ]
    });

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch assignments.' });
  }
});

// GET /classes/:classId/assignments
router.get('/classes/:classId/assignments', async (req, res) => {
  try {
    // Use the logged-in student's ID from session
    const studentId = req.session?.userId; 
    const { classId } = req.params;

    if (!studentId) {
      return res.status(401).json({ error: 'Not logged in.' });
    }

    // Ensure student is enrolled in classId
    const subject = await Subject.findOne({
      where: { id: classId },
      include: [{ model: Student, where: { id: studentId }, required: true }]
    });
    if (!subject) {
      return res.status(403).json({ error: 'You are not enrolled in this class.' });
    }

    // Fetch assignments with associated grades for this student
    const assignments = await Assignment.findAll({
      where: { subjectId: classId },
      include: [{ model: StudentAssignment, where: { studentId }, required: false }]
    });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch assignments.' });
  }
});

module.exports = router;