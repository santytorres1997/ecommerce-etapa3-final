import { Router } from 'express';
import * as controller from '../controllers/cart.controller.js';

const router = Router();

// POST /api/carrito
router.post('/', controller.create);

export default router;
