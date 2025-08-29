import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controller/authcontroller.js';
import { handleValidation } from '../middleware/validation.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register',
  [
    body('name').isLength({ min: 2 }).withMessage('Name 2+ chars'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password 6+ chars'),
    body('role').optional().isIn(['ADMIN', 'MEMBER']),
  ],
  handleValidation, register);

router.post('/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  handleValidation, login);

router.get('/me', protect, getMe);

export default router;
