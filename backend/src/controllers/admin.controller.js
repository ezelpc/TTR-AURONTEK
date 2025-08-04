import { loginAdminSistema} from '../services/admin.service';
import { registrarEmpresaCompleta } from '../services/empresa.service';
export async function loginAdmin(req, res){
  try {
    const respuesta = await loginAdminSistema(req.body);
    res.json(respuesta);
  } catch (err) {
    console.error('❌ Error al iniciar sesión admin:', err.message);
    res.status(401).json({
      message: 'Error al iniciar sesión',
    });
  }
}

export async function crearEmpresa(req, res) {
  try {
    const resultado = await registrarEmpresaCompleta(req.body);
    res.status(201).json(resultado);
  } catch (err) {
    console.error('❌ Error al registrar empresa:', err.message);
    res.status(400).json({error: err.message});
  }
}

