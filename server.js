import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { PORT } from './src/config/config.js';
import { connectDB } from './src/config/db.js';
import productRoutes from './src/routes/product.routes.js';
import cartRoutes from './src/routes/cart.routes.js';

const app = express();

// Necesario para __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (frontend)
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// API
app.use('/api/productos', productRoutes);
app.use('/api/carrito', cartRoutes);

// SPA fallback: cualquier ruta NO-API devuelve index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Handler de errores
app.use((err, req, res, next) => {
  console.error('❌ Error en el servidor:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar servidor sólo después de conectar a la DB
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('No se pudo conectar a MongoDB:', err);
    process.exit(1);
  });
