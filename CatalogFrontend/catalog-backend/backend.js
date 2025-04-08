const app = require('./app');
const sequelize = require('./db');

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to DB.");
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }
});