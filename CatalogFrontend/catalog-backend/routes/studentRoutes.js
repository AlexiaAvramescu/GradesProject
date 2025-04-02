const express = require('express');
const router = express.Router();
const models = require('../models'); // your models

// GET /student/:studentId/classes/:classId/assignments
router.get('/:studentId/classes/:classId/assignments', async (req, res) => {
  try {
    const { studentId, classId } = req.params;
    // Example lookup, adjust for your model names/associations
    const assignments = await models.Assignment.findAll({
      where: { classId },
      include: [{
        model: models.Grade,
        where: { studentId }
      }]
    });
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch assignments.' });
  }
});

module.exports = router;