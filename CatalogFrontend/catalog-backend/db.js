const path = require("path");
const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");

// Load environment-specific .env file
const env = process.env.NODE_ENV || "development";
const envPath = env === "test" ? ".env.test" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connected to MySQL (${env} environment)`);
  } catch (error) {
    console.error("Connection error:", error);
  }
})();

module.exports = sequelize;
