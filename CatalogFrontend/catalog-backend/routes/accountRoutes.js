const express = require('express');
const router = express.Router();
const { Student, Teacher } = require('../models');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management routes
 */

/**
 * @swagger
 * /changeUsername:
 *   put:
 *     summary: Change the username of a student or teacher
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newName
 *               - mail
 *               - isTeacher
 *             properties:
 *               newName:
 *                 type: string
 *                 description: New username to update
 *               mail:
 *                 type: string
 *                 format: email
 *                 description: Email of the user
 *               isTeacher:
 *                 type: boolean
 *                 description: Whether the user is a teacher (true) or student (false)
 *     responses:
 *       201:
 *         description: Username changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: boolean
 *       404:
 *         description: Email not found or invalid input
 *       400:
 *         description: Bad request or internal error
 */

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


/**
 * @swagger
 * /changePassword:
 *   put:
 *     summary: Change the password of a student or teacher
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mail
 *               - oldPassword
 *               - newPassword
 *               - isTeacher
 *             properties:
 *               mail:
 *                 type: string
 *                 format: email
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               isTeacher:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Wrong password or email not found
 *       400:
 *         description: Invalid request or internal error
 */
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