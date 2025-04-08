const express = require('express');
const router = express.Router();
const { Student, Subject, Teacher } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Teacher
 *   description: Teacher-related operations
 */

/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Create a new subject
 *     tags: [Teacher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - teacherId
 *             properties:
 *               name:
 *                 type: string
 *               teacherId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */

// POST /subjects - create a subject with teacherId
router.post('/subjects', async (req, res) => {
  console.log('Received request body:', req.body);
  const { name, teacherId } = req.body;
  console.log()
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


/**
 * @swagger
 * /subjects/enroll-students:
 *   post:
 *     summary: Enroll multiple students in a subject
 *     tags: [Teacher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - subjectId
 *               - studentIds
 *             properties:
 *               teacherId:
 *                 type: integer
 *               subjectId:
 *                 type: integer
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Students enrolled successfully
 *       400:
 *         description: Missing fields or invalid data
 *       404:
 *         description: Subject or students not found
 *       500:
 *         description: Server error
 */


router.post('/subjects/enroll-students', async (req, res) => {
  const { teacherId, subjectId, studentIds } = req.body;
  console.error(subjectId);


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



/**
 * @swagger
 * /subjects/remove-students:
 *   post:
 *     summary: Remove multiple students from a subject
 *     tags: [Teacher]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - subjectId
 *               - studentIds
 *             properties:
 *               teacherId:
 *                 type: integer
 *               subjectId:
 *                 type: integer
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Students removed from class
 *       400:
 *         description: Missing or invalid fields
 *       404:
 *         description: Subject or students not found
 *       500:
 *         description: Server error
 */

router.post('/subjects/remove-students', async (req, res) => {
  const { teacherId, subjectId, studentIds } = req.body;
  console.error(studentIds);

  if (!teacherId || !subjectId || !Array.isArray(studentIds)) {
    return res.status(400).json({ error: 'teacherId, subjectId, and studentIds are required.' });
  }
  console.error(2);


  try {
    // Ensure the subject exists and belongs to the teacher
    const subject = await Subject.findOne({
      where: { id: subjectId, teacherId },
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found or does not belong to the teacher.' });
    }
    console.error(3);

    // Find students by ID
    const students = await Student.findAll({
      where: { id: studentIds }
    });

    if (students.length === 0) {
      return res.status(404).json({ error: 'No matching students found.' });
    }
    console.error(4);

    // Remove association from the join table
    await subject.removeStudents(students); // Sequelize magic method

    res.status(200).json({ message: 'Students removed from class.', studentCount: students.length });
  } catch (error) {
    console.error('Error removing students from class:', error);
    res.status(500).json({ error: error});
  }
});

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Get all subjects for a teacher
 *     tags: [Teacher]
 *     parameters:
 *       - in: query
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the teacher
 *     responses:
 *       200:
 *         description: List of subjects
 *       404:
 *         description: Teacher not found
 *       500:
 *         description: Server error
 */

router.get('/subjects', async (req, res) => {
  const { teacherId } = req.query;
  console.log(teacherId)
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



/**
 * @swagger
 * /subjects/students:
 *   get:
 *     summary: Get all students in a class
 *     tags: [Teacher]
 *     parameters:
 *       - in: query
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the class/subject
 *     responses:
 *       200:
 *         description: List of students in the class
 *       400:
 *         description: Missing classId
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */
router.get('/subjects/students', async (req, res) => {
  const { classId } = req.query;

  if (!classId) {
    return res.status(400).json({ error: 'classId is required.' });
  }

  try {
    const subject = await Subject.findByPk(classId, {
      include: {
        model: Student,
        through: { attributes: [] }
      }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Class not found.' });
    }

    res.status(200).json(subject.Students); // ✅ only return student list
  } catch (error) {
    console.error('Error fetching students for class:', error);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});


/**
 * @swagger
 * /students/not-in-class:
 *   get:
 *     summary: Get students not enrolled in a specific class
 *     tags: [Teacher]
 *     parameters:
 *       - in: query
 *         name: classId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the class
 *     responses:
 *       200:
 *         description: List of students not in the class
 *       400:
 *         description: Missing classId
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */
router.get('/students/not-in-class', async (req, res) => {
  const { classId } = req.query;

  if (!classId) {
    return res.status(400).json({ error: 'classId is required' });
  }
  try {
    // Find students already in the class
    const subject = await Subject.findByPk(classId, {
      include: {
        model: Student,
        through: { attributes: [] }, // exclude join table attributes
      }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const enrolledStudentIds = subject.Students.map(s => s.id);

    // Get all students NOT in this class
    const studentsNotInClass = await Student.findAll({
      where: {
        id: {
          [require('sequelize').Op.notIn]: enrolledStudentIds
        }
      }
    });
    console.log(studentsNotInClass)
    res.status(200).json(studentsNotInClass);
  } catch (error) {
    console.error('Error fetching students not in class:', error);
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});


module.exports = router;
