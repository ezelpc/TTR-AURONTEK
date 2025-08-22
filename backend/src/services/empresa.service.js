// src/services/empresa.service.js
import supabase from "../utils/supabaseClient.js";
import { v4 as uuidv4 } from "uuid";
import { hashPassword } from "../utils/hash.js";

function generarPassTemporal(len = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generarCodigo() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numeros = '0123456789';
  const rand = (str, len) =>
    Array.from({ length: len }, () => str[Math.floor(Math.random() * str.length)]).join('');
  return `${rand(letras, 3)}${rand(numeros, 3)}`;
}

export async function registrarEmpresaCompleta({
  nombre_empresa,
  rfc,
  telefono,
  direccion,
  correo_contacto,
  contratante,
  licencia
}) {
  const empresa_id = uuidv4();
  const codigo = generarCodigo();

  // 1. Insertar empresa
  const { error: errorEmpresa } = await supabase.from('empresas').insert({
    id: empresa_id,
    nombre: nombre_empresa,
    rfc,
    telefono,
    direccion,
    correo_contacto,
    codigo_acceso: codigo,
    activa: true
  });
  if (errorEmpresa) throw new Error('Error al crear empresa');

  // 2. Insertar contratante
  const contratante_id = uuidv4();
  const { error: errorContratante } = await supabase.from('contratantes').insert({
    id: contratante_id,
    empresa_id,
    nombre: contratante.nombre,
    correo: contratante.correo,
    telefono: contratante.telefono,
    puesto: contratante.puesto,
    creado_en: new Date().toISOString()
  });
  if (errorContratante) throw new Error('Error al registrar contratante');

  // 3. Insertar licencia
  const { error: errorLicencia } = await supabase.from('licencias').insert({
    id: uuidv4(),
    empresa_id,
    fecha_inicio: licencia.fecha_inicio,
    fecha_fin: licencia.fecha_fin,
    estado: 'activa',
    plan: licencia.plan
  });
  if (errorLicencia) throw new Error('Error al registrar licencia');

  // 4. Crear usuario tipo admin_cliente para el contratante
  const contraseñaTemporal = generarPassTemporal();
  const hash = await hashPassword(contraseñaTemporal); // contraseña temporal real

  const { error: errorUsuario } = await supabase.from('usuarios').insert({
    id: uuidv4(),
    empresa_id,
    nombre: contratante.nombre,
    correo: contratante.correo,
    telefono: contratante.telefono,
    rol: 'gerente_cliente',
    area: 'TIC',
    contraseña: hash,
    activo: true,
    fecha_registro: new Date().toISOString(),
    puede_crear_usuarios: true
  });

  if (errorUsuario) {
    console.error('❌ Error al registrar usuario contratante:', errorUsuario);
    throw new Error('Error al registrar usuario contratante');
  }

  // 5. Respuesta
  return {
    ok: true,
    mensaje: 'Empresa registrada correctamente',
    empresa_id,
    codigo_acceso: codigo,
    contratante_usuario: {
      correo: contratante.correo,
      contraseña_temporal: contraseñaTemporal
    }
  };
}
