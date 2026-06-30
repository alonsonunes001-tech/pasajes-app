module.exports = (sequelize, DataTypes) => {
  const Viaje = sequelize.define('Viaje', {
    origen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destino: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalAsientos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 40,
    },
  });
  return Viaje;
};