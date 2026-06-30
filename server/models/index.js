const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Usuario = require('./usuario')(sequelize, Sequelize.DataTypes);
db.Viaje   = require('./viaje')(sequelize, Sequelize.DataTypes);
db.Asiento = require('./asiento')(sequelize, Sequelize.DataTypes);
db.Pasaje  = require('./pasaje')(sequelize, Sequelize.DataTypes);

// Asociaciones
db.Viaje.hasMany(db.Asiento,  { foreignKey: 'viajeId' });
db.Asiento.belongsTo(db.Viaje, { foreignKey: 'viajeId' });

db.Usuario.hasMany(db.Pasaje,  { foreignKey: 'usuarioId' });
db.Pasaje.belongsTo(db.Usuario, { foreignKey: 'usuarioId' });

db.Asiento.hasOne(db.Pasaje,   { foreignKey: 'asientoId' });
db.Pasaje.belongsTo(db.Asiento, { foreignKey: 'asientoId' });

db.Viaje.hasMany(db.Pasaje,    { foreignKey: 'viajeId' });
db.Pasaje.belongsTo(db.Viaje,  { foreignKey: 'viajeId' });

module.exports = db;