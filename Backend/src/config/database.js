const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // necessary for Render PostgreSQL
      },
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

// Test connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✓ Database connection established successfully");
  } catch (error) {
    console.error("✗ Unable to connect to database:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
