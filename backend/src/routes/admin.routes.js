import express from 'express';
import { loginAdmin, logoutAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/login', loginAdmin);

export default router;

