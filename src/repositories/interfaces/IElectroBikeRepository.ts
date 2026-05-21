import ElectroBike from "../../models/ElectroBike";
import {
  CrearElectroBikeInput,
  ElectroBikePersistInput,
  EstadoElectroBike,
  FiltrosElectroBike,
} from "../../types/domain";

export interface IElectroBikeRepository {
  findAll(filters?: FiltrosElectroBike): Promise<ElectroBike[]>;
  findById(id: number): Promise<ElectroBike | null>;
  findByMarcaYModelo(
    marcaId: number,
    modelo: string,
  ): Promise<ElectroBike | null>;
  create(data: ElectroBikePersistInput): Promise<ElectroBike>;
  update(
    entity: ElectroBike,
    data: Partial<ElectroBikePersistInput>,
  ): Promise<ElectroBike>;
  delete(entity: ElectroBike): Promise<void>;
  count(): Promise<number>;
  countByEstado(estado: EstadoElectroBike): Promise<number>;
  averagePrice(): Promise<string | null>;
  groupByEstado(): Promise<Array<{ estado: string; total: number }>>;
}
