import { Request, Response } from "express";
import { BrandService } from "../services/BrandService";
import { asyncHandler } from "../utils/asyncHandler";

const brandService = new BrandService();

export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await brandService.create(req.body);
  res.status(201).json(brand);
});

export const getBrands = asyncHandler(async (_req: Request, res: Response) => {
  const brands = await brandService.findAll();
  res.json(brands);
});

