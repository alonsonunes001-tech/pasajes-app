const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = isProduction
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME || 'pasajes_db',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || null,
      {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 5432,
        dialect: 'postgres',
        logging: false,
      }
    );

const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Usuario = require('./usuario')(sequelize, Sequelize.DataTypes);
db.Viaje   = require('./viaje')(sequelize, Sequelize.DataTypes);
db.Asiento = require('./asiento')(sequelize, Sequelize.DataTypes);
db.Pasaje  = require('./pasaje')(sequelize, Sequelize.DataTypes);

db.Viaje.hasMany(db.Asiento,   { foreignKey: 'viajeId' });
db.Asiento.belongsTo(db.Viaje, { foreignKey: 'viajeId' });

db.Usuario.hasMany(db.Pasaje,   { foreignKey: 'usuarioId' });
db.Pasaje.belongsTo(db.Usuario, { foreignKey: 'usuarioId' });

db.Asiento.hasOne(db.Pasaje,    { foreignKey: 'asientoId' });
db.Pasaje.belongsTo(db.Asiento, { foreignKey: 'asientoId' });

db.Viaje.hasMany(db.Pasaje,    { foreignKey: 'viajeId' });
db.Pasaje.belongsTo(db.Viaje,  { foreignKey: 'viajeId' });

module.exports = db;