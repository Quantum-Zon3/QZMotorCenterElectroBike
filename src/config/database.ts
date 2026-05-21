import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

type SupportedDialect = "mysql" | "postgres";

const databaseUrl = process.env.DATABASE_URL;
const explicitDialect = process.env.DB_DIALECT;
const inferDialect = (): SupportedDialect => {
  if (explicitDialect === "mysql" || explicitDialect === "postgres") {
    return explicitDialect;
  }

  if (databaseUrl) {
    if (
      databaseUrl.startsWith("postgres://") ||
      databaseUrl.startsWith("postgresql://")
    ) {
      return "postgres";
    }

    if (databaseUrl.startsWith("mysql://")) {
      return "mysql";
    }
  }

  return "mysql";
};

const databaseDialect = inferDialect();
const databaseName = process.env.DB_NAME ?? "qz_electrobike";
const databaseUser = process.env.DB_USER ?? "root";
const databasePassword = process.env.DB_PASSWORD ?? "";
const databaseHost = process.env.DB_HOST ?? "localhost";
const databasePort = Number(
  process.env.DB_PORT ?? (databaseDialect === "postgres" ? 5432 : 3306),
);
const autoCreateDatabase = process.env.DB_AUTO_CREATE === "true";
const databaseSsl = process.env.DB_SSL === "true";

const dialectOptions = databaseSsl
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : undefined;

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: databaseDialect,
      logging: false,
      dialectOptions,
    })
  : new Sequelize(databaseName, databaseUser, databasePassword, {
      host: databaseHost,
      port: databasePort,
      dialect: databaseDialect,
      logging: false,
      dialectOptions,
    });

const ensureDatabaseExists = async (): Promise<void> => {
  if (databaseDialect !== "mysql" || databaseUrl || !autoCreateDatabase) {
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

export const databaseEngineName =
  databaseDialect === "postgres" ? "PostgreSQL" : "MySQL";
export { databaseDialect };
export default sequelize;
