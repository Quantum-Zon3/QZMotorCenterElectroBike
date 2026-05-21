import ElectroBike from "./ElectroBike";
import Marca from "./Marca";

Marca.hasMany(ElectroBike, {
  foreignKey: "marcaId",
  as: "electroBikes",
});

ElectroBike.belongsTo(Marca, {
  foreignKey: "marcaId",
  as: "marca",
});

export { Marca, ElectroBike };

