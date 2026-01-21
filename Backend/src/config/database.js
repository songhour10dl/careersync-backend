const { Sequelize } = require("sequelize");

// Function to get database configuration
const getDatabaseConfig = () => {
  // Use DATABASE_URL if available (production / Render)
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);

    return {
      database: url.pathname.slice(1), // remove leading '/'
      username: url.username,
      password: url.password,
      host: url.hostname,
      port: url.port || 5432,
      dialect: "postgres",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Required for Render PostgreSQL
        },
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    };
  }

  // Fallback to individual environment variables (local dev)
  return {
    database: process.env.DB_NAME || "careersync_unified_db",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === "production"
          ? { require: true, rejectUnauthorized: false }
          : undefined,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
};

// Create Sequelize instance
const sequelize = new Sequelize(getDatabaseConfig());

// Test database connection
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
