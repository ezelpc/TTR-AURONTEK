import express from 'express';
import { entrenarModelo, predecirUrgenciaManual } from '../controllers/ia.controller.js';

const router = express.Router();

router.post('/entrenar-urgencia', entrenarModelo);
router.post('/predecir-urgencia', predecirUrgenciaManual); // ← Añade esta línea


export default router;