// src/services/admin-sistema.service.js
import supabase from '../utils/supabaseClient.js';
import { comparePassword } from '../utils/hash.js';
import jwt from 'jsonwebtoken';

/**
 * Login de un admin del sistema.
 * Solo permite login si el admin existe en la tabla admins_sistema.
 * @param {Object} params
 * @param {string} params.correo
 * @param {string} params.contraseña
 */
export async function loginAdminSistemaService({ correo, contraseña }) {
  const { data: admin, error } = await supabase
    .from('admins_sistema')
    .select('*')
    .eq('correo', correo)
    .maybeSingle();

  if (error || !admin) {
    throw new Error('Administrador no encontrado');
  }

  const valido = await comparePassword(contraseña, admin.contraseña);
  if (!valido) {
    throw new Error('Contraseña incorrecta');
  }

  // Firmamos JWT incluyendo el rol
  const token = jwt.sign(
    {
      id: admin.id,
      correo: admin.correo,
      nombre: admin.nombre,
      puesto: admin.puesto,
      admin: true
    },
    process.env.JWT,
    { expiresIn: '1h' }
  );

  const { contraseña: _, ...safeAdmin } = admin;

  return {
    ok: true,
    mensaje: 'Inicio de sesión exitoso',
    admin: safeAdmin,
    token
  };
}

/**
 * Verifica si un admin es Administrador General
 * @param {string} adminId
 */
export async function esAdminGeneral(adminId) {
  const { data, error } = await supabase
    .from('admins_sistema')
    .select('puesto')
    .eq('id', adminId)
    .maybeSingle();

  if (error || !data) return false;
  return data.puesto === 'Administrador General';
}
