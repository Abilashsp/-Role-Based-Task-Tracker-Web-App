import express from 'express';
import { body } from 'express-validator';
import {
  createTask, listTasks, getTask, updateTask, deleteTask
} from '../controller/taskcontroller.js';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidation } from '../middleware/validation.js';

const router = express.Router();

router.post('/',
  protect,
  [
    body('title').isLength({ min: 3 }).withMessage('Title 3+ chars'),
    body('description').isLength({ min: 5 }).withMessage('Description 5+ chars'),
    body('assigneeId').notEmpty().withMessage('assigneeId required'),
  ], handleValidation, createTask);

router.get('/', protect, listTasks);
router.get('/:id', protect, getTask);
router.patch('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

export default router;
