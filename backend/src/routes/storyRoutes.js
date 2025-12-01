import express from 'express';
import { createStory, getStories, deleteStory } from '../controllers/storyController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createStory);
router.get('/', protect, getStories);
router.delete('/:id', protect, deleteStory);

export default router;
