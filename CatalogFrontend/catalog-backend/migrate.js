const sequelize = require("./db");
const Student = require("./models/Student");
const Teacher = require("./models/Teacher");

(async () => {
  try {
    console.log("🔄 Încep sincronizarea bazei de date...");
    await sequelize.sync({ alter: true }); 
    console.log("Tabelele au fost create sau verificate cu succes.");
    process.exit();
  } catch (error) {
    console.error(" Eroare la sincronizare:", error);
    process.exit(1);
  }
})();