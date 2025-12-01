import Story from '../models/Story.js';
import User from '../models/User.js';

export const createStory = async (req, res) => {
  try {
    let imageURL = '';

    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      imageURL = `data:${req.file.mimetype};base64,${base64Image}`;
    } else {
      return res.status(400).json({ message: 'Image is required' });
    }

    const story = await Story.create({
      userId: req.userId,
      imageURL
    });

    const populatedStory = await Story.findById(story._id)
      .populate('userId', 'username profilePictureURL');

    res.status(201).json(populatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStories = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Get stories from followed users and self
    const userIds = [...user.following, req.userId];
    
    const stories = await Story.find({ userId: { $in: userIds } })
      .populate('userId', 'username profilePictureURL')
      .sort({ createdAt: -1 });

    // Group by user
    const groupedStories = {};
    stories.forEach(story => {
      const userId = story.userId._id.toString();
      if (!groupedStories[userId]) {
        groupedStories[userId] = {
          user: story.userId,
          stories: []
        };
      }
      groupedStories[userId].stories.push(story);
    });

    res.json(Object.values(groupedStories));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await story.deleteOne();
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
