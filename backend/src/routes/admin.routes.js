// src/routes/admin.routes.js
import express from 'express';
import { loginAdmin, crearEmpresa, recibirCodigoAcceso } from '../controllers/admin.controller.js';
import { requireAdminGeneral } from '../middlewares/requireAdminGeneral.middleware.js';

const router = express.Router();

router.post('/login', loginAdmin);

// ⬇️ Protegida por rol
router.post('/empresas/crear', requireAdminGeneral, crearEmpresa);

router.get('/acceso/:codigo', recibirCodigoAcceso);
export default router;
