import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const databaseName = process.env.DB_NAME ?? "qz_electrobike";
const databaseUser = process.env.DB_USER ?? "root";
const databasePassword = process.env.DB_PASSWORD ?? "";
const databaseHost = process.env.DB_HOST ?? "localhost";
const databasePort = Number(process.env.DB_PORT ?? 3306);
const autoCreateDatabase = process.env.DB_AUTO_CREATE === "true";

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: "mysql",
      logging: false,
    })
  : new Sequelize(databaseName, databaseUser, databasePassword, {
      host: databaseHost,
      port: databasePort,
      dialect: "mysql",
      logging: false,
    });

const ensureDatabaseExists = async (): Promise<void> => {
  if (databaseUrl || !autoCreateDatabase) {
    return;
  }

  const connection = await mysql.createConnection({
    host: databaseHost,
    port: databasePort,
    user: databaseUser,
    password: databasePassword,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await connection.end();
  }
};

export const initializeDatabase = async (): Promise<void> => {
  await ensureDatabaseExists();
  await sequelize.authenticate();
  await sequelize.sync();
};

export default sequelize;

