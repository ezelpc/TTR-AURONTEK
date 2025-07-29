import supabase from '../utils/supabaseClient.js';

function generarFolio(area, nombre) {
  const letrasArea = area.substring(0, 2).toUpperCase();
  const letraNombre = nombre.charAt(0).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000); // 4 dígitos
  return `${letrasArea}${letraNombre}${random}`;
}

export async function crearIncidencia({ titulo, descripcion, urgencia, usuario_id }) {
  const fecha_creacion = new Date().toISOString();

  const { data: usuario, error: errorUsuario } = await supabase
    .from('usuarios')
    .select('area, nombre')
    .eq('id', usuario_id)
    .single();

  if (errorUsuario || !usuario) {
    throw new Error('No se pudo obtener la información del usuario');
  }

  // Generar folio único
  let folio;
  let intento = 0;
  const maxIntentos = 5;

  while (intento < maxIntentos) {
    folio = generarFolio(usuario.area, usuario.nombre);

    const { data: existente } = await supabase
      .from('incidencias')
      .select('folio')
      .eq('folio', folio)
      .single();

    if (!existente) break; // folio único
    intento++;
  }

  if (intento === maxIntentos) {
    throw new Error('No se pudo generar un folio único para la incidencia');
  }

  const { error } = await supabase.from('incidencias').insert({
    folio,
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

  return {
    ok: true,
    message: 'Incidencia creada correctamente',
    folio
  };
}
