import dotenv from 'dotenv';
dotenv.config(); // Cargar variables de entorno primero

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASEURL;
const SUPABASE_KEY = process.env.SUPABASEKEY;

console.log('🔧 Supabase URL:', SUPABASE_URL);
console.log('🔧 Supabase KEY:', SUPABASE_KEY ? 'OK' : 'MISSING');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export default supabase;
