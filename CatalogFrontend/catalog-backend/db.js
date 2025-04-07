const path = require("path");
const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");

// 1. Load .env or .env.test based on NODE_ENV
const env = process.env.NODE_ENV || "development";
const envPath = env === "test" ? ".env.test" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envPath) });

// 2. Load config.json for that environment
const config = require(path.join(__dirname, 'config', 'config.json'))[env];

// 3. Use config directly instead of process.env
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: false,
  }
);

// 4. Optional test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Connected to MySQL (${env} environment)`);
  } catch (error) {
    console.error("❌ Connection error:", error);
  }
})();

module.exports = sequelize;
