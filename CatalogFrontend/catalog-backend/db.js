require("dotenv").config();
const { Sequelize } = require("sequelize");

// Creează conexiunea la baza de date
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "mysql",
  logging: false, // Dezactivează log-urile SQL
});

// Testează conexiunea
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectat la MySQL prin Sequelize.");
  } catch (error) {
    console.error("Eroare la conectarea la MySQL:", error);
  }
})();

module.exports = sequelize;
