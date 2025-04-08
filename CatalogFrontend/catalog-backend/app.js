require("dotenv").config();
const express = require("express");
const session = require('express-session');
const cors = require('cors');
const swaggerSpec = require('./config/swaggerConfig');
const swaggerUi = require('swagger-ui-express');

const app = express();



// Middleware
app.use(express.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET || 'securizare_sesiune',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));


// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Basic test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

if (process.env.NODE_ENV === 'test') {
  app.post('/test-login', (req, res) => {
    req.session.userId = req.body.userId;
    res.status(200).json({ message: 'Test login successful' });
  });
}


// Routes
const subjectRoutes = require('./routes/teacherRoutes');
app.use('/', subjectRoutes);

const studentRoutes = require('./routes/studentRoutes');
app.use('/student', studentRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

const accountRoutes = require('./routes/accountRoutes');
app.use('/', accountRoutes);

const assignmentsRoutes = require('./routes/assignmentsRoutes');
app.use('/', assignmentsRoutes);

const gradesRoutes = require('./routes/gradeRoutes');
app.use('/', gradesRoutes);

// Export the app for tests
module.exports = app;
