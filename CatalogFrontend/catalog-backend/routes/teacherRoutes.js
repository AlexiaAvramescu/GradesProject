const express = require('express');
const router = express.Router();
const { Student, Subject, Teacher } = require('../models');



// POST /subjects - create a subject with teacherId
router.post('/subjects', async (req, res) => {
  console.log('Received request body:', req.body); // 👀
  const { name, teacherId } = req.body;

  // Basic validation
  if (!name || !teacherId) {
    return res.status(400).json({ error: 'Both name and teacherId are required.' });
  }

  try {
    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }

    const subject = await Subject.create({
      name: name.trim(),
      teacherId: teacher.id
    });

    res.status(201).json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Failed to create subject.' });
  }
});



router.post('/subjects/enroll-students', async (req, res) => {
  const { teacherId, subjectId, studentIds } = req.body;

  if (!teacherId || !subjectId || !Array.isArray(studentIds)) {
    return res.status(400).json({ error: 'teacherId, subjectId and studentIds are required.' });
  }

  try {
    const subject = await Subject.findOne({
      where: { id: subjectId, teacherId: teacherId }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found or does not belong to the teacher.' });
    }

    const students = await Student.findAll({
      where: { id: studentIds }
    });

    if (students.length === 0) {
      return res.status(404).json({ error: 'No valid students found.' });
    }

    // Add students to the subject
    await subject.addStudents(students); // magic method from Sequelize many-to-many

    res.status(200).json({ message: 'Students enrolled successfully.', studentCount: students.length });
  } catch (error) {
    console.error('Error enrolling students:', error);
    res.status(500).json({ error: 'Failed to enroll students.' });
  }
});

router.get('/subjects', async (req, res) => {
  const { teacherId } = req.query;

  try {
    const teacher = await Teacher.findByPk(teacherId, {
      include: {
        model: Subject,
        as: 'Subjects'
      }
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found.' });
    }
    console.log(teacher.Subjects)
    res.status(200).json(teacher.Subjects); // Return the list of subjects
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects.' });
  }
});


module.exports = router;
