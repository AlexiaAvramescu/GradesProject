const express = require('express');
const router = express.Router();
const { Student, Teacher } = require('../models');

router.put('/changeUsername', async (req, res) => {

    const { newName, mail, isTeacher } = req.body;

    if (!newName && !mail && isTeacher != null) {
        console.log("ceva");
        return res.status(404).json({ error: 'Name, email or role not found.' });
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
            console.log("altceva");
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


module.exports = router;