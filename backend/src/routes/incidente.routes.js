import express from 'express';
import { crear } from '../controllers/incidente.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verificarToken, crear);

export default router;
