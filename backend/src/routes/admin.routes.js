import express from 'express';
import { loginAdmin, logoutAdmin, crearEmpresa, recibirCodigoAcceso} from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/empresas/crear', crearEmpresa);
router.get('/acceso/:codigo', recibirCodigoAcceso);


export default router;

