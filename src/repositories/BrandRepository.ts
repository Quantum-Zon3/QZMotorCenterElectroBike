import Marca from "../models/Marca";
import { CrearMarcaInput } from "../types/domain";
import { IBrandRepository } from "./interfaces/IBrandRepository";

export class BrandRepository implements IBrandRepository {
  async findAll(): Promise<Marca[]> {
    return Marca.findAll({
      order: [["nombre", "ASC"]],
    });
  }

  async findById(id: number): Promise<Marca | null> {
    return Marca.findByPk(id);
  }

  async findByName(nombre: string): Promise<Marca | null> {
    return Marca.findOne({
      where: { nombre },
    });
  }

  async create(data: CrearMarcaInput): Promise<Marca> {
    return Marca.create(data);
  }

  async count(): Promise<number> {
    return Marca.count();
  }
}

