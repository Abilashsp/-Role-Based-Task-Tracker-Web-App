import express from 'express';
import { listUsers,adminUpdateUser,adminDeleteUser } from '../controller/usercontroller.js';
import { protect ,authorize} from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ Secure version: use authenticated user's ID (from token)
router.get('/users', protect, listUsers);

// ✅ /me route for current user
router.get('/me', protect, (req, res) => res.json({ user: req.user }));
// router.get('/', protect, authorize('ADMIN'), listUsersWithCounts);
router.patch('/users/:id', protect, authorize('ADMIN'), adminUpdateUser);
router.delete('/users/:id', protect, authorize('ADMIN'), adminDeleteUser);

export default router;
