import express from 'express';
import { createPost, getFeed, getExploreFeed, getUserPosts, deletePost, likePost, repostPost, reactToPost, removeReaction } from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createPost);
router.get('/feed', protect, getFeed);
router.get('/explore', protect, getExploreFeed);
router.get('/user/:userId', protect, getUserPosts);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/react', protect, reactToPost);
router.delete('/:id/react', protect, removeReaction);
router.post('/:id/repost', protect, repostPost);

export default router;
