const express = require('express');
const router = express.Router();
const { Student, Subject, Teacher, Assignment } = require('../models');


router.get('/assignments', async (req, res) => {
    const { subjectId } = req.query;
  
    try {
      const assignments = await Assignment.findAll({
        where: { subjectId },
        attributes: ['id', 'title', 'description']
      });
  
      res.status(200).json(assignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      res.status(500).json({ error: 'Failed to fetch assignments.' });
    }
  });

  router.post('/assignments', async (req, res) => {
    const { subjectId, title, description } = req.body;
    console.log(subjectId)
    console.log(title)
    console.log(description)

    if (!subjectId || !title) {
      return res.status(400).json({ error: 'subjectId and title are required.' });
    }
  
    try {
      // Check if the subject (class) exists
      const subject = await Subject.findByPk(subjectId);
      if (!subject) {
        return res.status(404).json({ error: 'Subject not found.' });
      }
  
      const assignment = await Assignment.create({
        title,
        description,
        subjectId
      });
  
      res.status(201).json(assignment);
    } catch (error) {
      console.error('Error creating assignment:', error);
      res.status(500).json({ error: 'Failed to create assignment.' });
    }
  });
  
  module.exports = router;

  router.put('/assignments', async (req, res) => {
    const { id, title, description } = req.body;
    console.log(title)
    console.log(id)
    console.log(description)

    if (!id) {
      return res.status(400).json({ error: 'Assignment ID is required.' });
    }
  
    try {
      const assignment = await Assignment.findByPk(id);
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found.' });
      }
  
      assignment.title = title ?? assignment.title;
      assignment.description = description ?? assignment.description;
  
      await assignment.save();
  
      res.status(200).json(assignment);
    } catch (error) {
      console.error('Error updating assignment:', error);
      res.status(500).json({ error: 'Failed to update assignment.' });
    }
  });
  
  router.delete('/assignments', async (req, res) => {
    const { id } = req.body;
  
    if (!id) {
      return res.status(400).json({ error: 'Assignment ID is required.' });
    }
  
    try {
      const assignment = await Assignment.findByPk(id);
      if (!assignment) {
        return res.status(404).json({ error: 'Assignment not found.' });
      }
  
      await assignment.destroy();
  
      res.status(200).json({ message: 'Assignment deleted successfully.' });
    } catch (error) {
      console.error('Error deleting assignment:', error);
      res.status(500).json({ error: 'Failed to delete assignment.' });
    }
  });
  