import express from 'express';
import { sendMessage, getConversation, getConversations, getUnreadCount } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.get('/unread-count', protect, getUnreadCount);
router.get('/:userId', protect, getConversation);

export default router;
