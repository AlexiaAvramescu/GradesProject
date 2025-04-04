const express = require('express');
const router = express.Router();
const { Student, Teacher } = require('../models');
const { Op } = require('sequelize');

router.put('/change/password', async (req, res) => {

    const { username, password, email, isTeacher } = req.body;

    if (!username && !password && !email && isTeacher != null) {
        return res.status(400).json({ error: 'Name, password, and email are required.' });
    }

    try {
        let user;
        if (isTeacher == true) {
            user = await Teacher.findOne({
                where: { email: email }
            });
        }
        else if (isTeacher == false) {
            user = await Student.findOne({
                where: { email: email }
            });
        }
       
        if (!user) { 
            return res.status(400).json({ message: 'Username, email or password is wrong' });
        }

        req.session.user = { id: user.id, email: user.email, name: user.name, role: isTeacher };
        res.status(200).json({ message: 'Autentificat cu succes!', user: req.session.user });
        

    } catch (error) {
        console.error('Error creating subject:', error);
        res.status(400).json({ message: 'Utilizator invalid!' });
    }
});
