import supabase from '../utils/supabaseClient.js';

export async function crearIncidencia({ titulo, descripcion, urgencia, usuario_id }) {
  const fecha_creacion = new Date().toISOString();

  const { error } = await supabase.from('incidencias').insert({
    titulo,
    descripcion,
    urgencia,
    estado: 'pendiente',
    usuario_reporta: usuario_id,
    fecha_creacion,
  });

  if (error) {
    console.log('❌ Error Supabase:', error);
    throw new Error(`Error al crear la incidencia: ${error.message}`);
  }

  return { ok: true, message: 'Incidencia creada correctamente' };
}
