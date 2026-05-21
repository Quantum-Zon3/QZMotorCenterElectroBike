import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  console.error("Unexpected error:", error);

  res.status(500).json({
    message: "Ocurrio un error interno en el microservicio.",
  });
};

