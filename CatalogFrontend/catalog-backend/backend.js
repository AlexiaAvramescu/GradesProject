require("dotenv").config();
const express = require("express");
const sequelize = require("./db"); 
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const cors = require('cors');
app.use(cors());

// Routes
const subjectRoutes = require('./routes/teacherRoutes'); // adjust path if needed
app.use('/', subjectRoutes);

const PORT = 5000;
app.listen(PORT, async () => {

  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
