import { crearIncidencia } from "../services/incidente.service.js";

export async function crear(req, res) {
  try {
    const { titulo, descripcion, urgencia } = req.body;
    const usuario_id = req.usuario.id;

    if (!titulo || !descripcion || !urgencia) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const resultado = await crearIncidencia({ titulo, descripcion, urgencia, usuario_id });
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
