import express from 'express';
import { loginAdmin, logoutAdmin, crearEmpresa } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/empresas/crear', crearEmpresa);


export default router;

