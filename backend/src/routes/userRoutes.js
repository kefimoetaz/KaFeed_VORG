import express from 'express';
import { getProfile, updateProfile, followUser, unfollowUser, searchUsers, getSuggestedUsers } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/search', protect, searchUsers);
router.get('/suggested', protect, getSuggestedUsers);
router.get('/:id', protect, getProfile);
router.put('/profile', protect, upload.single('image'), updateProfile);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);

export default router;
