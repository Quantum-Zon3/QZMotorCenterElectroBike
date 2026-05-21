import {
  CreationOptional,
  DataTypes,
  InferCreationAttributes,
  InferAttributes,
  Model,
} from "sequelize";
import sequelize from "../config/database";

class Marca extends Model<
  InferAttributes<Marca>,
  InferCreationAttributes<Marca>
> {
  declare id: CreationOptional<number>;
  declare nombre: string;
  declare pais: string;
  declare anioFundacion: number | null;
  declare sitioWeb: string | null;
}

Marca.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
    pais: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    anioFundacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    sitioWeb: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "marcas",
    timestamps: true,
  },
);

export default Marca;
