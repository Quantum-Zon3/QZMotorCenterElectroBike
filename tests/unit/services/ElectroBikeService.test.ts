import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppError } from "../../../src/errors/AppError";
import { IBrandRepository } from "../../../src/repositories/interfaces/IBrandRepository";
import { IElectroBikeRepository } from "../../../src/repositories/interfaces/IElectroBikeRepository";
import { ElectroBikeService } from "../../../src/services/ElectroBikeService";

describe("ElectroBikeService", () => {
  const electroBikeRepository: IElectroBikeRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByMarcaYModelo: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
    countByEstado: vi.fn(),
    averagePrice: vi.fn(),
    groupByEstado: vi.fn(),
  };

  const brandRepository: IBrandRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByName: vi.fn(),
    create: vi.fn(),
    count: vi.fn(),
  };

  let service: ElectroBikeService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ElectroBikeService(electroBikeRepository, brandRepository);
  });

  it("crea una ElectroBike cuando la marca existe y no hay duplicados", async () => {
    vi.mocked(brandRepository.findById).mockResolvedValue({
      id: 1,
      nombre: "Super Soco",
    } as never);
    vi.mocked(electroBikeRepository.findByMarcaYModelo).mockResolvedValue(null);
    vi.mocked(electroBikeRepository.create).mockResolvedValue({
      id: 7,
      modelo: "TC Max",
      estado: "disponible",
    } as never);

    const result = await service.create({
      marcaId: 1,
      modelo: "TC Max",
      categoria: "urbana",
      capacidadBateriaWh: 5200,
      autonomiaKm: 110,
      velocidadMaximaKmh: 95,
      tiempoCargaHoras: 4.5,
      precio: 25500,
      stock: 6,
      estado: "disponible",
      fotoUrl: "https://example.com/tc-max.png",
    });

    expect(brandRepository.findById).toHaveBeenCalledWith(1);
    expect(electroBikeRepository.findByMarcaYModelo).toHaveBeenCalledWith(
      1,
      "TC Max",
    );
    expect(electroBikeRepository.create).toHaveBeenCalled();
    expect(result).toMatchObject({
      id: 7,
      modelo: "TC Max",
    });
  });

  it("falla si la marca no existe", async () => {
    vi.mocked(brandRepository.findById).mockResolvedValue(null);
    vi.mocked(electroBikeRepository.findByMarcaYModelo).mockResolvedValue(null);

    await expect(
      service.create({
        marcaId: 999,
        modelo: "Ghost Rider",
        categoria: "deportiva",
        capacidadBateriaWh: 6000,
        autonomiaKm: 150,
        velocidadMaximaKmh: 120,
        tiempoCargaHoras: 5,
        precio: 42000,
        stock: 2,
        estado: "disponible",
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(electroBikeRepository.create).not.toHaveBeenCalled();
  });

  it("construye el resumen del catalogo usando operaciones asincronas", async () => {
    vi.mocked(electroBikeRepository.count).mockResolvedValue(18);
    vi.mocked(electroBikeRepository.countByEstado).mockResolvedValue(12);
    vi.mocked(electroBikeRepository.averagePrice).mockResolvedValue("27450.55");
    vi.mocked(brandRepository.count).mockResolvedValue(5);
    vi.mocked(electroBikeRepository.groupByEstado).mockResolvedValue([
      { estado: "disponible", total: 12 },
      { estado: "reservada", total: 4 },
      { estado: "mantenimiento", total: 2 },
    ]);

    const result = await service.getCatalogSummary();

    expect(result).toEqual({
      totalElectroBikes: 18,
      electroBikesDisponibles: 12,
      precioPromedio: 27450.55,
      totalMarcas: 5,
      distribucionPorEstado: {
        disponible: 12,
        reservada: 4,
        mantenimiento: 2,
      },
    });
  });
});

