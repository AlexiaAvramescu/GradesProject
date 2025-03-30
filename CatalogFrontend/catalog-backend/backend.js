require("dotenv").config();
const express = require("express");
const sequelize = require("./db"); 
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
