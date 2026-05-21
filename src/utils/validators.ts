import { AppError } from "../errors/AppError";

export const validarTextoRequerido = (
  valor: unknown,
  campo: string,
): string => {
  if (typeof valor !== "string" || valor.trim().length === 0) {
    throw new AppError(400, `El campo "${campo}" es obligatorio.`);
  }

  return valor.trim();
};

export const validarNumeroPositivo = (
  valor: unknown,
  campo: string,
  opciones?: { entero?: boolean; permitirCero?: boolean },
): number => {
  const numero = Number(valor);

  if (Number.isNaN(numero) || !Number.isFinite(numero)) {
    throw new AppError(400, `El campo "${campo}" debe ser numerico.`);
  }

  if (!opciones?.permitirCero && numero <= 0) {
    throw new AppError(400, `El campo "${campo}" debe ser mayor a cero.`);
  }

  if (opciones?.permitirCero && numero < 0) {
    throw new AppError(400, `El campo "${campo}" no puede ser negativo.`);
  }

  if (opciones?.entero && !Number.isInteger(numero)) {
    throw new AppError(400, `El campo "${campo}" debe ser un entero.`);
  }

  return numero;
};

export const validarNumeroOpcional = (
  valor: unknown,
  campo: string,
  opciones?: { entero?: boolean; permitirCero?: boolean },
): number | undefined => {
  if (valor === undefined || valor === null || valor === "") {
    return undefined;
  }

  return validarNumeroPositivo(valor, campo, opciones);
};

export const validarNumeroEnteroOpcionalONulo = (
  valor: unknown,
  campo: string,
): number | null | undefined => {
  if (valor === undefined) {
    return undefined;
  }

  if (valor === null || valor === "") {
    return null;
  }

  return validarNumeroPositivo(valor, campo, {
    entero: true,
    permitirCero: false,
  });
};

export const validarTextoOpcionalONulo = (
  valor: unknown,
  campo: string,
): string | null | undefined => {
  if (valor === undefined) {
    return undefined;
  }

  if (valor === null || valor === "") {
    return null;
  }

  return validarTextoRequerido(valor, campo);
};

export const validarEnum = <T extends readonly string[]>(
  valor: unknown,
  opciones: T,
  campo: string,
): T[number] => {
  if (typeof valor !== "string" || !opciones.includes(valor as T[number])) {
    throw new AppError(
      400,
      `El campo "${campo}" debe ser uno de estos valores: ${opciones.join(", ")}.`,
    );
  }

  return valor as T[number];
};

export const validarId = (valor: unknown, campo = "id"): number => {
  return validarNumeroPositivo(valor, campo, { entero: true });
};

