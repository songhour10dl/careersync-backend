const { Sequelize } = require("sequelize");

const getDatabaseConfig = () => {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);

    return {
      database: url.pathname.slice(1),
      username: url.username,
      password: url.password,
      host: url.hostname,
      port: url.port || 5432,
      dialect: "postgres",
      logging: process.env.NODE_ENV === "development" ? console.log : false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Render requires this for external connections
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

  return {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
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

const sequelize = new Sequelize(getDatabaseConfig());

module.exports = { sequelize };
