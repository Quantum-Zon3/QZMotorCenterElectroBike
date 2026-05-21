import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../../../src/errors/AppError";
import { BrandService } from "../../../src/services/BrandService";
import { IBrandRepository } from "../../../src/repositories/interfaces/IBrandRepository";

describe("BrandService", () => {
  const brandRepository: IBrandRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  };

  let service: BrandService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new BrandService(brandRepository);
  });

  it("crea una marca cuando no existe previamente", async () => {
    vi.mocked(brandRepository.findByName).mockResolvedValue(null);
    vi.mocked(brandRepository.create).mockResolvedValue({
      id: 1,
      nombre: "Zero Motorcycles",
    } as never);

    const result = await service.create({
      nombre: "Zero Motorcycles",
      pais: "Estados Unidos",
      anioFundacion: 2006,
      sitioWeb: "https://zeromotorcycles.com",
    });

    expect(brandRepository.findByName).toHaveBeenCalledWith("Zero Motorcycles");
    expect(brandRepository.create).toHaveBeenCalled();
    expect(result).toMatchObject({
      id: 1,
      nombre: "Zero Motorcycles",
    });
  });

  it("falla si la marca ya existe", async () => {
    vi.mocked(brandRepository.findByName).mockResolvedValue({
      id: 4,
      nombre: "Vmoto",
    } as never);

    await expect(
      service.create({
        nombre: "Vmoto",
        pais: "Australia",
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(brandRepository.create).not.toHaveBeenCalled();
  });
});

