import express from 'express';
import { login, registrar } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/registro', registrar); // <--- nuevo

export default router;
