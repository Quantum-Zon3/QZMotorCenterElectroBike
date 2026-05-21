import { col, fn, Op, WhereOptions } from "sequelize";
import { ElectroBike, Marca } from "../models";
import {
  ElectroBikePersistInput,
  EstadoElectroBike,
  FiltrosElectroBike,
} from "../types/domain";
import { IElectroBikeRepository } from "./interfaces/IElectroBikeRepository";

export class ElectroBikeRepository implements IElectroBikeRepository {
  async findAll(filters?: FiltrosElectroBike): Promise<ElectroBike[]> {
    const where: WhereOptions = {};

    if (filters?.marcaId !== undefined) {
      where.marcaId = filters.marcaId;
    }

    if (filters?.estado !== undefined) {
      where.estado = filters.estado;
    }

    if (filters?.minAutonomiaKm !== undefined) {
      where.autonomiaKm = {
        [Op.gte]: filters.minAutonomiaKm,
      };
    }

    if (filters?.maxPrecio !== undefined) {
      where.precio = {
        [Op.lte]: filters.maxPrecio,
      };
    }

    return ElectroBike.findAll({
      where,
      include: [
        {
          model: Marca,
          as: "marca",
          attributes: ["id", "nombre", "pais"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async findById(id: number): Promise<ElectroBike | null> {
    return ElectroBike.findByPk(id, {
      include: [
        {
          model: Marca,
          as: "marca",
          attributes: ["id", "nombre", "pais"],
        },
      ],
    });
  }

  async findByMarcaYModelo(
    marcaId: number,
    modelo: string,
  ): Promise<ElectroBike | null> {
    return ElectroBike.findOne({
      where: {
        marcaId,
        modelo,
      },
    });
  }

  async create(data: ElectroBikePersistInput): Promise<ElectroBike> {
    return ElectroBike.create(data);
  }

  async update(
    entity: ElectroBike,
    data: Partial<ElectroBikePersistInput>,
  ): Promise<ElectroBike> {
    return entity.update(data);
  }

  async delete(entity: ElectroBike): Promise<void> {
    await entity.destroy();
  }

  async count(): Promise<number> {
    return ElectroBike.count();
  }

  async countByEstado(estado: EstadoElectroBike): Promise<number> {
    return ElectroBike.count({
      where: { estado },
    });
  }

  async averagePrice(): Promise<string | null> {
    const result = await ElectroBike.findOne({
      attributes: [[fn("AVG", col("precio")), "precioPromedio"]],
      raw: true,
    });

    return (result as { precioPromedio: string | null } | null)?.precioPromedio ?? null;
  }

  async groupByEstado(): Promise<Array<{ estado: string; total: number }>> {
    const result = await ElectroBike.findAll({
      attributes: ["estado", [fn("COUNT", col("id")), "total"]],
      group: ["estado"],
      raw: true,
    });

    return result as unknown as Array<{ estado: string; total: number }>;
  }
}
