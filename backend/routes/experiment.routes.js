import { Router } from 'express';
import { experimentController } from '../controllers/experiment.controller.js';

const router = Router();

router.get('/', experimentController.getAll);
router.get('/:id', experimentController.getById);
router.post('/', experimentController.create);
router.put('/:id', experimentController.update);
router.delete('/:id', experimentController.delete);

export default router;