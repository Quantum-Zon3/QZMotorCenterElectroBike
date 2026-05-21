import ElectroBike from "../models/ElectroBike";
import { BrandRepository } from "../repositories/BrandRepository";
import { ElectroBikeRepository } from "../repositories/ElectroBikeRepository";
import { IBrandRepository } from "../repositories/interfaces/IBrandRepository";
import { IElectroBikeRepository } from "../repositories/interfaces/IElectroBikeRepository";
import {
  CATEGORIAS_ELECTROBIKE,
  CrearElectroBikeInput,
  ESTADOS_ELECTROBIKE,
  ElectroBikePersistInput,
  EstadoElectroBike,
  FiltrosElectroBike,
  ResumenCatalogo,
} from "../types/domain";
import {
  validarEnum,
  validarId,
  validarNumeroOpcional,
  validarNumeroPositivo,
  validarTextoOpcionalONulo,
  validarTextoRequerido,
} from "../utils/validators";
import { AppError } from "../errors/AppError";

export class ElectroBikeService {
  constructor(
    private readonly electroBikeRepository: IElectroBikeRepository = new ElectroBikeRepository(),
    private readonly brandRepository: IBrandRepository = new BrandRepository(),
  ) {}

  async create(payload: CrearElectroBikeInput) {
    const data = this.sanitizePayload(payload);

    const [brand, duplicateBike] = await Promise.all([
      this.brandRepository.findById(data.marcaId),
      this.electroBikeRepository.findByMarcaYModelo(data.marcaId, data.modelo),
    ]);

    if (!brand) {
      throw new AppError(404, "La marca asociada no existe.");
    }

    if (duplicateBike) {
      throw new AppError(
        409,
        "Ya existe una ElectroBike con ese modelo para la marca indicada.",
      );
    }

    return this.electroBikeRepository.create(data);
  }

  async findAll(filters?: FiltrosElectroBike) {
    const sanitizedFilters = this.sanitizeFilters(filters);
    return this.electroBikeRepository.findAll(sanitizedFilters);
  }

  async findById(id: number) {
    const entity = await this.requireElectroBike(id);
    return entity;
  }

  async update(id: number, payload: Partial<CrearElectroBikeInput>) {
    const entity = await this.requireElectroBike(id);
    const current = entity.get({ plain: true }) as ElectroBikePersistInput & {
      id: number;
    };

    const data = this.sanitizePayload({
      marcaId: payload.marcaId ?? current.marcaId,
      modelo: payload.modelo ?? current.modelo,
      categoria: payload.categoria ?? current.categoria,
      capacidadBateriaWh:
        payload.capacidadBateriaWh ?? current.capacidadBateriaWh,
      autonomiaKm: payload.autonomiaKm ?? current.autonomiaKm,
      velocidadMaximaKmh:
        payload.velocidadMaximaKmh ?? current.velocidadMaximaKmh,
      tiempoCargaHoras: payload.tiempoCargaHoras ?? current.tiempoCargaHoras,
      precio: payload.precio ?? current.precio,
      stock: payload.stock ?? current.stock,
      estado: payload.estado ?? (current.estado as EstadoElectroBike),
      fotoUrl: payload.fotoUrl ?? current.fotoUrl,
    });

    const [brand, duplicateBike] = await Promise.all([
      this.brandRepository.findById(data.marcaId),
      this.electroBikeRepository.findByMarcaYModelo(data.marcaId, data.modelo),
    ]);

    if (!brand) {
      throw new AppError(404, "La marca asociada no existe.");
    }

    if (duplicateBike && duplicateBike.get("id") !== id) {
      throw new AppError(
        409,
        "Ya existe una ElectroBike con ese modelo para la marca indicada.",
      );
    }

    return this.electroBikeRepository.update(entity, data);
  }

  async delete(id: number) {
    const entity = await this.requireElectroBike(id);
    await this.electroBikeRepository.delete(entity);

    return {
      message: "ElectroBike eliminada correctamente.",
      id,
    };
  }

  async getCatalogSummary(): Promise<ResumenCatalogo> {
    const [totalElectroBikes, electroBikesDisponibles, averagePrice, totalMarcas, byStatus] =
      await Promise.all([
        this.electroBikeRepository.count(),
        this.electroBikeRepository.countByEstado("disponible"),
        this.electroBikeRepository.averagePrice(),
        this.brandRepository.count(),
        this.electroBikeRepository.groupByEstado(),
      ]);

    const distribucionPorEstado: ResumenCatalogo["distribucionPorEstado"] = {
      disponible: 0,
      reservada: 0,
      mantenimiento: 0,
    };

    byStatus.forEach((item) => {
      if (item.estado in distribucionPorEstado) {
        distribucionPorEstado[item.estado as EstadoElectroBike] = Number(item.total);
      }
    });

    return {
      totalElectroBikes,
      electroBikesDisponibles,
      precioPromedio: averagePrice ? Number(Number(averagePrice).toFixed(2)) : 0,
      totalMarcas,
      distribucionPorEstado,
    };
  }

  private async requireElectroBike(id: number): Promise<ElectroBike> {
    const validId = validarId(id);
    const entity = await this.electroBikeRepository.findById(validId);

    if (!entity) {
      throw new AppError(404, "La ElectroBike solicitada no existe.");
    }

    return entity;
  }

  private sanitizeFilters(filters?: FiltrosElectroBike): FiltrosElectroBike | undefined {
    if (!filters) {
      return undefined;
    }

    return {
      marcaId:
        filters.marcaId !== undefined ? validarId(filters.marcaId, "marcaId") : undefined,
      estado:
        filters.estado !== undefined
          ? validarEnum(filters.estado, ESTADOS_ELECTROBIKE, "estado")
          : undefined,
      minAutonomiaKm:
        filters.minAutonomiaKm !== undefined
          ? validarNumeroPositivo(filters.minAutonomiaKm, "minAutonomiaKm")
          : undefined,
      maxPrecio:
        filters.maxPrecio !== undefined
          ? validarNumeroPositivo(filters.maxPrecio, "maxPrecio")
          : undefined,
    };
  }

  private sanitizePayload(payload: CrearElectroBikeInput): ElectroBikePersistInput {
    return {
      marcaId: validarId(payload.marcaId, "marcaId"),
      modelo: validarTextoRequerido(payload.modelo, "modelo"),
      categoria: validarEnum(
        payload.categoria,
        CATEGORIAS_ELECTROBIKE,
        "categoria",
      ),
      capacidadBateriaWh: validarNumeroPositivo(
        payload.capacidadBateriaWh,
        "capacidadBateriaWh",
        { entero: true },
      ),
      autonomiaKm: validarNumeroPositivo(payload.autonomiaKm, "autonomiaKm"),
      velocidadMaximaKmh: validarNumeroPositivo(
        payload.velocidadMaximaKmh,
        "velocidadMaximaKmh",
      ),
      tiempoCargaHoras: validarNumeroPositivo(
        payload.tiempoCargaHoras,
        "tiempoCargaHoras",
      ),
      precio: validarNumeroPositivo(payload.precio, "precio"),
      stock: validarNumeroPositivo(payload.stock, "stock", {
        entero: true,
        permitirCero: true,
      }),
      estado: payload.estado
        ? validarEnum(payload.estado, ESTADOS_ELECTROBIKE, "estado")
        : "disponible",
      fotoUrl: validarTextoOpcionalONulo(payload.fotoUrl, "fotoUrl") ?? null,
    };
  }
}
