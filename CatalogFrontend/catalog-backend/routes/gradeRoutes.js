const express = require('express');
const { Student, StudentAssignment, Assignment, Subject  } = require('../models');
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: Grade management routes
 */

/**
 * @swagger
 * /grades:
 *   get:
 *     summary: Get all grades for a specific assignment
 *     tags: [Grades]
 *     parameters:
 *       - in: query
 *         name: assignmentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the assignment
 *     responses:
 *       200:
 *         description: List of grades
 *       400:
 *         description: Missing assignmentId parameter
 *       500:
 *         description: Internal server error
 */
router.get('/grades', async (req, res) => {
  try {
    const { assignmentId } = req.query;

    if (!assignmentId) {
      return res.status(400).json({ error: 'Missing assignmentId parameter' });
    }

    const grades = await StudentAssignment.findAll({
      where: { assignmentId },
      attributes: ['studentId', 'assignmentId', 'grade']
    });

    // Ensure plain JSON objects (not Sequelize instances)
    const simplified = grades.map(g => ({
      studentId: g.studentId,
      assignmentId: g.assignmentId,
      grade: g.grade
    }));
    //console.log(simplified)
    res.json(simplified);
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



/**
 * @swagger
 * /grades:
 *   post:
 *     summary: Add or update grades for multiple students
 *     tags: [Grades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [assignmentId, studentIds, grade]
 *             properties:
 *               assignmentId:
 *                 type: integer
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               grade:
 *                 type: number
 *     responses:
 *       200:
 *         description: Grades added/updated successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/grades', async (req, res) => {
  console.log(1)
  try {
    const { assignmentId, studentIds, grade } = req.body;
    console.log(2)
    console.log(assignmentId)
    console.log("\n")
    console.log(studentIds)
    console.log(grade)

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

    res.status(200).json({ message: 'Grades added/updated successfully' });
  } catch (error) {
    console.error('Error adding grades:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



/**
 * @swagger
 * /grades:
 *   delete:
 *     summary: Delete grades for multiple students
 *     tags: [Grades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [assignmentId, studentIds]
 *             properties:
 *               assignmentId:
 *                 type: integer
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Grades deleted successfully
 *       400:
 *         description: Missing assignmentId or studentIds
 *       500:
 *         description: Internal server error
 */

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


/**
 * @swagger
 * /grades:
 *   put:
 *     summary: Update a grade for a specific student and assignment
 *     tags: [Grades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [assignmentId, studentId, grade]
 *             properties:
 *               assignmentId:
 *                 type: integer
 *               studentId:
 *                 type: integer
 *               grade:
 *                 type: number
 *     responses:
 *       200:
 *         description: Grade updated successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Internal server error
 */
router.put('/grades', async (req, res) => {
  try {
    const { assignmentId, studentId, grade } = req.body;
    ///console.log(assignmentId)
    //console.log(studentId)
    //console.log(assignmentId)

    if (!assignmentId || !studentId || grade === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Find the existing record
    const studentAssignment = await StudentAssignment.findOne({
      where: { assignmentId, studentId }
    });

    if (!studentAssignment) {
      return res.status(404).json({ error: 'Grade not found' });
    }

    // Update the grade
    studentAssignment.grade = grade;
    await studentAssignment.save();

    res.json({ message: 'Grade updated successfully', updatedGrade: studentAssignment });
  } catch (error) {
    console.error('Error updating grade:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/**
 * @swagger
 * /history:
 *   get:
 *     summary: Get grading history for a teacher
 *     tags: [Grades]
 *     parameters:
 *       - in: query
 *         name: teacherId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the teacher
 *     responses:
 *       200:
 *         description: List of graded assignments and students
 *       400:
 *         description: Missing teacherId
 *       500:
 *         description: Internal server error
 */

router.get('/history', async (req, res) => {
  const { teacherId } = req.query;
  console.log(teacherId)
  if (!teacherId) {
    return res.status(400).json({ message: 'Teacher ID is required' });
  }

  try {
    const grades = await StudentAssignment.findAll({
      include: [
        {
          model: Student,
          as: 'Student',
          attributes: ['name']
        },
        {
          model: Assignment,
          as: 'Assignment',
          attributes: ['title', 'createdAt'],
          include: [
            {
              model: Subject,
              as: 'Subject',
              attributes: ['name'],
              where: { teacherId } // Filter by teacherId
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formatted = grades.map(grade => ({
      className: grade.Assignment?.Subject?.name || 'Unknown',
      assignmentName: grade.Assignment?.title || 'Unknown',
      studentName: grade.Student?.name || 'Unknown',
      grade: grade.grade,
      dateCreated: grade.Assignment?.createdAt?.toISOString().split('T')[0] || 'N/A'
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Error fetching grade history:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Get subject details by ID
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the subject
 *     responses:
 *       200:
 *         description: Subject details
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 */
router.get('/subjects/:id', async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Class not found' });
    res.json(subject);
  } catch (error) {
    console.error('Error fetching class:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



module.exports = router;
