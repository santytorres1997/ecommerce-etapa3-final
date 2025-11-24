import { Router } from 'express';
import * as controller from '../controllers/product.controller.js';

const router = Router();

// GET /api/productos
router.get('/', controller.getAll);

// GET /api/productos/:id
router.get('/:id', controller.getById);

// POST /api/productos
router.post('/', controller.create);

// PUT /api/productos/:id
router.put('/:id', controller.update);

// DELETE /api/productos/:id
router.delete('/:id', controller.remove);

export default router;
