module.exports = (sequelize, DataTypes) => {
  const Asiento = sequelize.define('Asiento', {
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    viajeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Asiento;
};