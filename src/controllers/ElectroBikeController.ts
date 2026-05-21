import { Request, Response } from "express";
import { ElectroBikeService } from "../services/ElectroBikeService";
import { EstadoElectroBike } from "../types/domain";
import { asyncHandler } from "../utils/asyncHandler";

const electroBikeService = new ElectroBikeService();

export const createElectroBike = asyncHandler(
  async (req: Request, res: Response) => {
    const electroBike = await electroBikeService.create(req.body);
    res.status(201).json(electroBike);
  },
);

export const getElectroBikes = asyncHandler(
  async (req: Request, res: Response) => {
    const electroBikes = await electroBikeService.findAll({
      marcaId:
        typeof req.query.marcaId === "string"
          ? Number(req.query.marcaId)
          : undefined,
      estado:
        typeof req.query.estado === "string"
          ? (req.query.estado as EstadoElectroBike)
          : undefined,
      minAutonomiaKm:
        typeof req.query.minAutonomiaKm === "string"
          ? Number(req.query.minAutonomiaKm)
          : undefined,
      maxPrecio:
        typeof req.query.maxPrecio === "string"
          ? Number(req.query.maxPrecio)
          : undefined,
    });

    res.json(electroBikes);
  },
);

export const getElectroBikeById = asyncHandler(
  async (req: Request, res: Response) => {
    const electroBike = await electroBikeService.findById(Number(req.params.id));
    res.json(electroBike);
  },
);

export const updateElectroBike = asyncHandler(
  async (req: Request, res: Response) => {
    const electroBike = await electroBikeService.update(
      Number(req.params.id),
      req.body,
    );
    res.json(electroBike);
  },
);

export const deleteElectroBike = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await electroBikeService.delete(Number(req.params.id));
    res.json(result);
  },
);

export const getCatalogSummary = asyncHandler(
  async (_req: Request, res: Response) => {
    const summary = await electroBikeService.getCatalogSummary();
    res.json(summary);
  },
);
