import {
  CreationOptional,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/database";
import {
  CATEGORIAS_ELECTROBIKE,
  ESTADOS_ELECTROBIKE,
} from "../types/domain";

class ElectroBike extends Model<
  InferAttributes<ElectroBike>,
  InferCreationAttributes<ElectroBike>
> {
  declare id: CreationOptional<number>;
  declare marcaId: number;
  declare modelo: string;
  declare categoria: string;
  declare capacidadBateriaWh: number;
  declare autonomiaKm: number;
  declare velocidadMaximaKmh: number;
  declare tiempoCargaHoras: number;
  declare precio: number;
  declare stock: number;
  declare estado: string;
  declare fotoUrl: string | null;
}

ElectroBike.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    marcaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "marcas",
        key: "id",
      },
    },
    modelo: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    categoria: {
      type: DataTypes.ENUM(...CATEGORIAS_ELECTROBIKE),
      allowNull: false,
    },
    capacidadBateriaWh: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    autonomiaKm: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    velocidadMaximaKmh: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tiempoCargaHoras: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    estado: {
      type: DataTypes.ENUM(...ESTADOS_ELECTROBIKE),
      allowNull: false,
      defaultValue: "disponible",
    },
    fotoUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "electrobikes",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["marcaId", "modelo"],
      },
      {
        fields: ["estado"],
      },
    ],
  },
);

export default ElectroBike;
