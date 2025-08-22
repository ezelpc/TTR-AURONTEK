import { loginAdminSistemaService } from '../services/admin-sistema.service.js';

export async function loginAdminSistemaController(req, res) {
  try {
    const { correo, contraseña } = req.body;
    const resp = await loginAdminSistemaService({ correo, contraseña });
    res.json(resp);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}
