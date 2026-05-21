import { AppError } from "../errors/AppError";
import { BrandRepository } from "../repositories/BrandRepository";
import { IBrandRepository } from "../repositories/interfaces/IBrandRepository";
import { CrearMarcaInput } from "../types/domain";
import {
  validarNumeroEnteroOpcionalONulo,
  validarTextoOpcionalONulo,
  validarTextoRequerido,
} from "../utils/validators";

export class BrandService {
  constructor(private readonly brandRepository: IBrandRepository = new BrandRepository()) {}

  async create(payload: CrearMarcaInput) {
    const data = this.sanitizePayload(payload);
    const existingBrand = await this.brandRepository.findByName(data.nombre);

    if (existingBrand) {
      throw new AppError(409, "La marca ya existe en el catalogo.");
    }

    return this.brandRepository.create(data);
  }

  async findAll() {
    return this.brandRepository.findAll();
  }

  private sanitizePayload(payload: CrearMarcaInput): CrearMarcaInput {
    return {
      nombre: validarTextoRequerido(payload.nombre, "nombre"),
      pais: validarTextoRequerido(payload.pais, "pais"),
      anioFundacion:
        validarNumeroEnteroOpcionalONulo(payload.anioFundacion, "anioFundacion") ??
        null,
      sitioWeb: validarTextoOpcionalONulo(payload.sitioWeb, "sitioWeb") ?? null,
    };
  }
}

