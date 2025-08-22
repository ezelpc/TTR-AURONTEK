import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/auth.routes.js';
import incidenteRoutes from './src/routes/incidente.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import  supabase  from './src/utils/supabaseClient';
import iaRoutes from './src/routes/ia.routes.js';
import adminSistemaRoutes from './src/routes/admin-sistema.routes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/incidentes', incidenteRoutes);
app.use('/admin',adminRoutes);
app.use('/api/admin-sistema', adminSistemaRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
