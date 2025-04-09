const express = require('express');
const router = express.Router();
const { Student, Teacher } = require('../models');
const { Op } = require('sequelize');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and session management routes
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user (teacher or student)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - isTeacher
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               isTeacher:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Login successful
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
 *       400:
 *         description: Invalid credentials or input
 */
router.post('/login', async (req, res) => {
    const { username, password, email, isTeacher } = req.body;
    console.log(username)
    console.log(password)
    console.log(email)
    console.log(isTeacher)

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
            console.log(user)
        }
        else if (isTeacher == false) {
            user = await Student.findOne({
                where:
                    { [Op.and]: [{ email: email }, { name: username }, { password: password }] }
            });
        }
        //console.log(user);
        if (!user) { //instanceof Teacher || user instanceof Student) {
            return res.status(400).json({ message: 'Username, email or password is wrong' });
        }

        
        return res.status(201).json({
            message: "Login successful",
            user: { id: user.id, name: user.name, email: user.email, role: isTeacher },
          });
        //here there needs to be a password validation if we encryt the password on register 

    } catch (error) {
        res.status(400).json({ message: 'Utilizator invalid!' });
    }
});


/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user (teacher or student)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - isTeacher
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               isTeacher:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Registration successful
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
 *       400:
 *         description: Email already used or invalid input
 */
router.post('/register', async (req, res) => {
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

        let newUser;
        if (!user) {
            if (isTeacher == true) {
                newUser= await Teacher.create({
                    name: username,
                    email: email,
                    password: password
                });
            }
            else {
                newUser = await Student.create({
                    name: username,
                    email: email,
                    password: password
                });
            }   

            
            return res.status(201).json({
                message: "Login successful",
                user: { id: newUser.id, name: newUser.name, email: newUser.email, role: isTeacher },
              });
        }
        res.status(400).json({ message: 'This email is already used by another account' });

        //here there needs to be a password validation if we encryt the password on register 

    } catch (error) {
        console.error('Error creating subject:', error);
        res.status(400).json({ message: 'Utilizator invalid!' });
    }
});


/**
 * @swagger
 * /session:
 *   get:
 *     summary: Get current session user info
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Session is active and user is returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: No session found or user not logged in
 */

router.get('/session', (req, res) => {
    if (req.session.user) {
        res.status(200).json(req.session.user);
    } else {
        res.status(400).json({ message: "idk man" });
    }
});


/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout the current session
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Error during logout
 */
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Eroare la delogare' });
        }
        res.json({ message: 'Delogat cu succes!' });
    });
});

module.exports = router;
