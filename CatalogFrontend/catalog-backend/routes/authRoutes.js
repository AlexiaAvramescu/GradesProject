const express = require('express');
const router = express.Router();
const { Student, Teacher } = require('../models');
const { Op } = require('sequelize');

router.post('/login', async (req, res) => {
    const { username, password, email, isTeacher } = req.body;

    if (!username && !password && !email && isTeacher != null) {
        return res.status(400).json({ error: 'Name, password, and email are required.' });
    }
    try {
        let user;
        if (isTeacher == true) {
            user = await Teacher.findOne({
                where:
                    { [Op.and]: [{ email: email }, { name: username }, { password: password }] }
            });
        }
        else if(isTeacher==false) {
            user = await Student.findOne({
                where:
                    { [Op.and]: [{ email: email }, { name: username }, { password: password }] }
            });
        }
        //console.log(user);
        if (!user) { //instanceof Teacher || user instanceof Student) {
            return res.status(400).json({ message: 'Username, email or password is wrong' });
        }

        req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role };
        res.status(200).json({ message: 'Autentificat cu succes!', user: req.session.user });

        //here there needs to be a password validation if we encryt the password on register 

    } catch (error) {
        console.error('Error creating subject:', error);
        res.status(400).json({ message: 'Utilizator invalid!' });
    }
});





router.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Eroare la delogare' });
        }
        res.json({ message: 'Delogat cu succes!' });
    });
});

module.exports = router;
