import express from 'express';
import supabase from './src/utils/supabaseClient'; // Importar el cliente de Supabase

const app = express();
const PORT = process.env.PORT || 3000;



app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
