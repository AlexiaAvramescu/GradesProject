const express = require('express');
const router = express.Router();
const { Student, Teacher } = require('../models');

router.put('/changeUsername', async (req, res) => {

    const { newName, mail, isTeacher } = req.body;

    if (!newName && !mail && isTeacher != null) {
        return res.status(404).json({ error: 'Email not found.' });
    }

    try {
        let user;
        if (isTeacher == true) {
            [user] = await Teacher.update(
                { name: newName }, 
                { where: { email: mail }
            });
        }
        else if (isTeacher == false) {
            [user] = await Student.update(
                { name: newName }, 
                { where: { email: mail }
            });
        }
        if (!user) 
        {
            return res.status(404).json({ message: 'This email is not found' });
        }
        return res.status(201).json({
            message: "Username changed succesfully",
            user: { id: user.id, name: user.name, email: user.email, role: isTeacher },
        });
    }
    catch (error) {
        console.error('Error updating username:', error);
        res.status(400).json({ message: 'Utilizator invalid!' });
    }

});

router.put('/changePassword', async (req, res) => {

    const { mail, oldPassword, newPassword, isTeacher } = req.body;

    if (!mail && !oldPassword && !newPassword && isTeacher != null) {
        console.log("ceva");
        return res.status(404).json({ error: 'Email not found.' });
    }

    try {
        let user;
        let userUpdated;
        if (isTeacher == true) {
            user = await Teacher.findOne(
                { where: { email: mail, password: oldPassword }
            });
        }
        else if (isTeacher == false) {
            user = await Student.findOne(
                { where: { email: mail, password: oldPassword }
            });
        }
        if (!user) 
        {
            console.log("altceva");
            return res.status(404).json({ message: 'Wrong password' });
        }
        else{

            if (isTeacher == true) {
                [userUpdated] = await Teacher.update(
                    { password: newPassword }, 
                    { where: { email: mail }
                });
            }
            else if (isTeacher == false) {
                [userUpdated] = await Student.update(
                    {  password: newPassword }, 
                    { where: { email: mail }
                });
            }
        }
        if(!userUpdated)
        {
            return res.status(404).json({ message: 'This email is not found' });
        }

        return res.status(201).json({
            message: "Username changed succesfully",
        });
    }
    catch (error) {
        console.error('Error updating username:', error);
        res.status(400).json({ message: 'Utilizator invalid!' });
    }

});


module.exports = router;