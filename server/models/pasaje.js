module.exports = (sequelize, DataTypes) => {
  const Pasaje = sequelize.define('Pasaje', {
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    viajeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    asientoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });
  return Pasaje;
};