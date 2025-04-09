const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();
const { Assignment, Subject, Student, StudentAssignment } = require('../models');

// GET /overview
// Returns a history of all graded assignments (newest first)
router.get('/overview', async (req, res) => {
  try {
    const studentId = req.session?.userId;
    if (!studentId) {
      return res.status(401).json({ error: 'Not logged in.' });
    }
    const records = await StudentAssignment.findAll({
      where: {
        studentId,
        grade: { [Op.ne]: null }
      },
      include: [
        {
          model: Assignment,
          as: 'Assignment',
          attributes: ['id', 'title', 'createdAt'],
          include: [
            {
              model: Subject,
              as: 'Subject',
              attributes: ['name']
            }
          ]
        }
      ],
      order: [[{ model: Assignment, as: 'Assignment' }, 'createdAt', 'DESC']]
    });

    const historyList = records.map(r => ({
      id: r.Assignment?.id,
      assignmentTitle: r.Assignment?.title || 'Unknown',
      subjectName: r.Assignment?.Subject?.name || 'Unknown',
      grade: r.grade,
      dateCreated: r.Assignment?.createdAt
        ? r.Assignment.createdAt.toISOString().split('T')[0]
        : 'N/A'
    }));

    res.json(historyList);
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
});

// GET /assignment
// Returns all currently active (ungraded) assignments for this student
router.get('/assignment', async (req, res) => {
  try {
    const studentId = req.session?.userId;
    if (!studentId) {
      return res.status(401).json({ error: 'Not logged in.' });
    }
    // Fetch all subjects that the student is enrolled in
    const subjects = await Subject.findAll({
      include: [{ model: Student, where: { id: studentId }, required: true }]
    });
    const subjectIds = subjects.map(s => s.id);

    // Fetch all assignments for these subjects
    const allAssignments = await Assignment.findAll({
      where: { subjectId: { [Op.in]: subjectIds } },
      include: [
        {
          model: StudentAssignment,
          as: 'StudentAssignments',
          where: { studentId },
          required: false
        }
      ]
    });

    // Filter to get only those that are not graded yet
    const ungraded = allAssignments.filter(a => {
      const assignmentRecord = a.StudentAssignments?.[0];
      return !assignmentRecord || assignmentRecord.grade == null;
    });

    res.json(ungraded);
  } catch (error) {
    console.error('Error fetching ungraded assignments:', error);
    res.status(500).json({ error: 'Failed to fetch ungraded assignments' });
  }
});

// GET /grades
// Returns a list of subjects and the average grade for each
router.get('/grades', async (req, res) => {
  try {
    const studentId = req.session?.userId;
    if (!studentId) {
      return res.status(401).json({ error: 'Not logged in.' });
    }

    const subjects = await Subject.findAll({
      include: [
        {
          model: Student,
          where: { id: studentId },
          required: true
        },
        {
          model: Assignment,
          as: 'Assignments',
          include: [
            {
              model: StudentAssignment,
              where: { studentId },
              required: false
            }
          ]
        }
      ]
    });

    const results = subjects.map((subject) => {
      const allGrades = [];
      subject.Assignments?.forEach((assignment) => {
        const sa = assignment.StudentAssignments?.[0];
        if (sa && sa.grade !== null && sa.grade !== undefined) {
          allGrades.push(sa.grade);
        }
      });
      const avg = allGrades.length
        ? (allGrades.reduce((sum, g) => sum + g, 0) / allGrades.length).toFixed(2)
        : null;
      return {
        subjectName: subject.name,
        averageGrade: avg || 'N/A'
      };
    });

    return res.json(results);
  } catch (error) {
    console.error('Error fetching grades:', error);
    return res.status(500).json({ error: 'Failed to fetch grades' });
  }
});

module.exports = router;