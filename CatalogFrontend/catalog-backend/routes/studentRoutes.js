const express = require('express');
const router = express.Router();
const { Assignment, Grade } = require('../models');

// GET /student/:studentId/classes/:classId/assignments
router.get('/:studentId/classes/:classId/assignments', async (req, res) => {
  try {
    const { studentId, classId } = req.params;
    const assignments = await Assignment.findAll({
      where: { subjectId: classId }, // Make sure to match the field in the model
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

module.exports = router;