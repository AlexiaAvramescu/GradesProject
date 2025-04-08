const express = require('express');
const router = express.Router();
const { Assignment, Subject, Student, StudentAssignment } = require('../models');

// GET /student/:studentId/history
router.get('/:studentId/history', async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await StudentAssignment.findAll({
      where: { studentId },
      include: [
        {
          model: Assignment,
          as: 'Assignment',
          attributes: ['title', 'createdAt'],
          include: [
            {
              model: Subject,
              as: 'Subject',
              attributes: ['name']
            }
          ]
        }
      ],
      order: [['Assignment', 'createdAt', 'ASC']]
    });

    const list = records.map(r => ({
      assignmentTitle: r.Assignment?.title || 'Unknown',
      subjectName: r.Assignment?.Subject?.name || 'Unknown',
      grade: r.grade,
      dateCreated: r.Assignment?.createdAt?.toISOString().split('T')[0] || 'N/A'
    }));

    res.json(list);
  } catch (error) {
    console.error('Error fetching student history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

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
          model: StudentAssignment,
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