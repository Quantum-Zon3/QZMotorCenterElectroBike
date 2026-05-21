export const CATEGORIAS_ELECTROBIKE = [
  "urbana",
  "deportiva",
  "doble_proposito",
  "delivery",
] as const;

export const ESTADOS_ELECTROBIKE = [
  "disponible",
  "reservada",
  "mantenimiento",
] as const;

export type CategoriaElectroBike = (typeof CATEGORIAS_ELECTROBIKE)[number];
export type EstadoElectroBike = (typeof ESTADOS_ELECTROBIKE)[number];

export interface CrearMarcaInput {
  nombre: string;
  pais: string;
  anioFundacion?: number | null;
  sitioWeb?: string | null;
}

export interface CrearElectroBikeInput {
  marcaId: number;
  modelo: string;
  categoria: CategoriaElectroBike;
  capacidadBateriaWh: number;
  autonomiaKm: number;
  velocidadMaximaKmh: number;
  tiempoCargaHoras: number;
  precio: number;
  stock: number;
  estado?: EstadoElectroBike;
  fotoUrl?: string | null;
}

export interface ElectroBikePersistInput
  extends Omit<CrearElectroBikeInput, "estado" | "fotoUrl"> {
  estado: EstadoElectroBike;
  fotoUrl: string | null;
}

export interface FiltrosElectroBike {
  marcaId?: number;
  estado?: EstadoElectroBike;
  minAutonomiaKm?: number;
  maxPrecio?: number;
}

export interface ResumenCatalogo {
  totalElectroBikes: number;
  electroBikesDisponibles: number;
  precioPromedio: number;
  totalMarcas: number;
  distribucionPorEstado: Record<EstadoElectroBike, number>;
}
