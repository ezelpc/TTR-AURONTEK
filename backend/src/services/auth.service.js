import supabase  from '../utils/supabaseClient.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export async function registrarUsuario({
  nombre,
  correo,
  contraseña,
  rol,
  puede_crear_usuarios = false,
  foto_url = '',
  activo = true
}) {
  // Verificar si ya existe
  const { data: existente } = await supabase
    .from('usuarios')
    .select('id')
    .eq('correo', correo)
    .maybeSingle();

  if (existente) {
    throw new Error('Ya existe un usuario con ese correo');
  }

  const hashed = await hashPassword(contraseña);
  const id = uuidv4();
  const fecha_registro = new Date().toISOString();

  const { error } = await supabase.from('usuarios').insert({
    id,
    nombre,
    correo,
    contraseña: hashed,
    rol,
    puede_crear_usuarios,
    foto_url,
    activo,
    fecha_registro
  });

  if (error) {
    throw new Error('Error al registrar usuario');
  }

  return { ok: true, mensaje: 'Usuario registrado correctamente' };
}

export async function loginUsuario({ correo, contraseña }) {
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('correo', correo)
    .maybeSingle();
  if (error || !usuario) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const esValido = await comparePassword(contraseña, usuario.contraseña);
  if (!esValido) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const token = jwt.sign(
    { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
    process.env.JWT,
    { expiresIn: '1h' }
  );

  // 👇 Aquí está la corrección
  const { contraseña: _, ...safeUser } = usuario;

  return {
    ok: true,
    mensaje: 'Login exitoso',
    usuario: safeUser,
    token
  };
}
