import app from "./app";
import { databaseEngineName, initializeDatabase } from "./config/database";
import "./models";

const port = Number(process.env.PORT ?? 3000);
const dbHost = process.env.DB_HOST ?? "localhost";
const dbPort = Number(process.env.DB_PORT ?? 3306);

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();
    console.log(`Conexion a ${databaseEngineName} establecida correctamente.`);

    app.listen(port, "0.0.0.0", () => {
      console.log(`ElectroBike microservice running on port ${port}`);
    });
  } catch (error) {
    const connectionCode =
      (error as { original?: { code?: string }; parent?: { code?: string } })
        ?.original?.code ??
      (error as { parent?: { code?: string } })?.parent?.code;

    if (connectionCode === "ECONNREFUSED") {
      console.error(
        [
          `No fue posible iniciar el microservicio: la base de datos no responde en ${dbHost}:${dbPort}.`,
          "Sugerencias:",
          "1. Si vas a usar Docker, inicia Docker Desktop y luego ejecuta: docker compose up -d db",
          "2. Si vas a usar una base local, verifica que el servicio este encendido en el puerto configurado",
          "3. Si vas a usar Render, revisa que DATABASE_URL y DB_DIALECT esten configurados correctamente",
          "4. Luego vuelve a ejecutar: npm run dev",
        ].join("\n"),
      );
    } else {
      console.error("No fue posible iniciar el microservicio:", error);
    }

    process.exit(1);
  }
};

void startServer();
