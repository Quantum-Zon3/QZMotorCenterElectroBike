import app from "./app";
import { initializeDatabase } from "./config/database";
import "./models";

const port = Number(process.env.PORT ?? 3000);

const startServer = async (): Promise<void> => {
  try {
    await initializeDatabase();
    console.log("Conexion a MySQL establecida correctamente.");

    app.listen(port, () => {
      console.log(`ElectroBike microservice running on port ${port}`);
    });
  } catch (error) {
    console.error("No fue posible iniciar el microservicio:", error);
    process.exit(1);
  }
};

void startServer();

