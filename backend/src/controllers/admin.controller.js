import { loginAdminSistema} from '../services/admin.service';

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
