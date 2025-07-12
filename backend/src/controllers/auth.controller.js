import { registrarUsuario, loginUsuario } from '../services/auth.service.js';

export async function registrar(req, res) {
  try {
    const respuesta = await registrarUsuario(req.body);
    res.status(201).json(respuesta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const datos = await loginUsuario(req.body);
    res.json(datos);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}
