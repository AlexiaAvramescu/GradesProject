const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const Student = require("../models/Student");


// POST /subjects
router.post('/subjects', async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Class name is required.' });
  }

  try {
    const subject = await Subject.create({ name: name.trim() });
    res.status(201).json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Failed to create subject.' });
  }
});

router.get('/subjects', async (req, res) => {

  const student = await Student.findByPk(1);
  const subject = await Subject.findByPk(1);

  if (student && subject) {
    console.log("Available student methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(student)));

    await student.addSubject(subject); // this now works
    res.status(201).json({ message: 'Enrolled!' });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});


module.exports = router;
