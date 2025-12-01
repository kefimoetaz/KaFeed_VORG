import express from 'express';
import { createPost, getFeed, getExploreFeed, getUserPosts, deletePost, likePost, repostPost } from '../controllers/postControllerLocal.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createPost);
router.get('/feed', protect, getFeed);
router.get('/explore', protect, getExploreFeed);
router.get('/user/:userId', protect, getUserPosts);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/repost', protect, repostPost);

export default router;
