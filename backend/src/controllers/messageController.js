import Message from '../models/Message.js';
import User from '../models/User.js';

export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const message = await Message.create({
      senderId: req.userId,
      receiverId,
      text
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'username profilePictureURL')
      .populate('receiverId', 'username profilePictureURL');

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: userId },
        { senderId: userId, receiverId: req.userId }
      ]
    })
    .populate('senderId', 'username profilePictureURL')
    .populate('receiverId', 'username profilePictureURL')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { senderId: userId, receiverId: req.userId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    // Get all unique users the current user has messaged with
    const messages = await Message.find({
      $or: [
        { senderId: req.userId },
        { receiverId: req.userId }
      ]
    })
    .populate('senderId', 'username profilePictureURL')
    .populate('receiverId', 'username profilePictureURL')
    .sort({ createdAt: -1 });

    // Group by conversation partner
    const conversationsMap = new Map();
    
    for (const message of messages) {
      const partnerId = message.senderId._id.toString() === req.userId 
        ? message.receiverId._id.toString() 
        : message.senderId._id.toString();
      
      if (!conversationsMap.has(partnerId)) {
        const partner = message.senderId._id.toString() === req.userId 
          ? message.receiverId 
          : message.senderId;
        
        // Count unread messages
        const unreadCount = await Message.countDocuments({
          senderId: partnerId,
          receiverId: req.userId,
          read: false
        });

        conversationsMap.set(partnerId, {
          user: partner,
          lastMessage: message,
          unreadCount
        });
      }
    }

    const conversations = Array.from(conversationsMap.values());
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.userId,
      read: false
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
