import Marca from "../../models/Marca";
import { CrearMarcaInput } from "../../types/domain";

export interface IBrandRepository {
  findAll(): Promise<Marca[]>;
  findById(id: number): Promise<Marca | null>;
  findByName(nombre: string): Promise<Marca | null>;
  create(data: CrearMarcaInput): Promise<Marca>;
  count(): Promise<number>;
}

