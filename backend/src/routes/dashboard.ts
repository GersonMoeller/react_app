
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getDashboardData } from '../controllers/dashboardController';

const router = Router();

// Aplica o middleware de autenticação antes de permitir acesso ao controlador da rota
router.get('/dashboard', authMiddleware, getDashboardData);

export default router;
