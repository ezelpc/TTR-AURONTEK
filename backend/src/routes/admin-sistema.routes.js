// src/routes/admin-sistema.routes.js
import express from 'express';
import { loginAdminSistemaController } from '../controllers/admin-sistema.controller.js';

const router = express.Router();

// POST /api/admin-sistema/login
router.post('/login', loginAdminSistemaController);

export default router;
