console.log('ENV:', process.env.DATABASE_URL ? 'DATABASE_URL encontrada' : 'DATABASE_URL NO encontrada');
console.log('NODE_ENV:', process.env.NODE_ENV);
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { sequelize } = require('./models');

const authRoutes     = require('./routes/auth');
const viajesRoutes   = require('./routes/viajes');
const asientosRoutes = require('./routes/asientos');
const pasajesRoutes  = require('./routes/pasajes');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/auth',     authRoutes);
app.use('/api/viajes',   viajesRoutes);
app.use('/api/asientos', asientosRoutes);
app.use('/api/pasajes',  pasajesRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a BD establecida');
    app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
  })
  .catch(err => {
  console.error('❌ Error conectando a BD:', err);
    process.exit(1);
  });