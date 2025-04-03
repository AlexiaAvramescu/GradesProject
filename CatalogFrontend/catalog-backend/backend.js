require("dotenv").config();
const express = require("express");
const sequelize = require("./db"); 
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'securizare_sesiune',
  resave: false,
  saveUninitialized: false,
  cookie: {
      secure: false,  // setează true dacă folosești HTTPS
      httpOnly: true, 
      maxAge: 1000 * 60 * 60  // 1 oră
  }
}));


app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const cors = require('cors');
app.use(cors());

//ROUTES

const subjectRoutes = require('./routes/teacherRoutes');
app.use('/', subjectRoutes);


const authRoutes = require('./routes/authRoutes'); 
app.use('/', authRoutes);

const assignmentsRoutes = require('./routes/assignmentsRoutes'); 
app.use('/', assignmentsRoutes);

const gradesRoutes = require('./routes/gradeRoutes'); 
app.use('/', gradesRoutes);



const PORT = 5000;
app.listen(PORT, async () => {

  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
