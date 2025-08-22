// src/middlewares/requireAdminGeneral.js
import jwt from 'jsonwebtoken';
import supabase from '../utils/supabaseClient.js';

export async function requireAdminGeneral(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Falta token' });

    const payload = jwt.verify(token, process.env.JWT);

    const { data: admin, error } = await supabase
      .from('admins_sistema')
      .select('id, puesto, correo')
      .eq('id', payload.id)
      .maybeSingle();

    if (error || !admin) return res.status(403).json({ error: 'No autorizado' });
    if (admin.puesto !== 'Administrador General') {
      return res.status(403).json({ error: 'Requiere puesto Administrador General' });
    }
    req.admin_sistema = admin;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}
