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

// GET /student/:studentId/averages
router.get('/:studentId/averages', async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await StudentAssignment.findAll({
      where: { studentId },
      include: [
        {
          model: Assignment,
          attributes: ['id', 'title'],
          include: [{ model: Subject, attributes: ['id', 'name'] }]
        }
      ]
    });

    // Group by subject and compute average
    const grouped = {};
    records.forEach((ra) => {
      if (!ra.Assignment || !ra.Assignment.Subject) return;
      const subj = ra.Assignment.Subject;
      if (!grouped[subj.id]) {
        grouped[subj.id] = { subjectId: subj.id, subjectName: subj.name, sum: 0, count: 0 };
      }
      if (ra.grade != null) {
        grouped[subj.id].sum += ra.grade;
        grouped[subj.id].count += 1;
      }
    });

    const results = Object.values(grouped).map((g) => ({
      subjectId: g.subjectId,
      subjectName: g.subjectName,
      average: g.count > 0 ? (g.sum / g.count).toFixed(2) : 'N/A'
    }));

    res.json(results);
  } catch (error) {
    console.error('Error fetching averages:', error);
    res.status(500).json({ error: 'Failed to fetch averages.' });
  }
});

module.exports = router;