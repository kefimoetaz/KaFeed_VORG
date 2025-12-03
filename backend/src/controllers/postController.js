import Post from '../models/Post.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let imageURL = '';

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'posts' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      imageURL = result.secure_url;
    }

    const post = await Post.create({
      userId: req.userId,
      text,
      imageURL
    });

    const populatedPost = await Post.findById(post._id).populate('userId', 'username profilePictureURL');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeed = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const posts = await Post.find({ userId: { $in: [...user.following, req.userId] } })
      .populate('userId', 'username profilePictureURL')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExploreFeed = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('userId', 'username profilePictureURL')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .populate('userId', 'username profilePictureURL')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.userId)) {
      post.likes = post.likes.filter(id => id.toString() !== req.userId);
    } else {
      post.likes.push(req.userId);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reactToPost = async (req, res) => {
  try {
    const { reactionType } = req.body; // 'like', 'love', 'laugh', 'wow', 'sad', 'angry'
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Remove existing reaction from this user
    post.reactions = post.reactions.filter(
      r => r.userId.toString() !== req.userId
    );

    // Add new reaction
    post.reactions.push({
      userId: req.userId,
      type: reactionType
    });

    // Also update likes array for backward compatibility
    if (!post.likes.includes(req.userId)) {
      post.likes.push(req.userId);
    }

    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'username profilePictureURL')
      .populate('reactions.userId', 'username profilePictureURL');
    
    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeReaction = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Remove reaction
    post.reactions = post.reactions.filter(
      r => r.userId.toString() !== req.userId
    );

    // Remove from likes array
    post.likes = post.likes.filter(id => id.toString() !== req.userId);

    await post.save();
    
    const populatedPost = await Post.findById(post._id)
      .populate('userId', 'username profilePictureURL')
      .populate('reactions.userId', 'username profilePictureURL');
    
    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const repostPost = async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id);
    
    if (!originalPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const repost = await Post.create({
      userId: req.userId,
      text: req.body.text || originalPost.text,
      imageURL: originalPost.imageURL,
      originalPostId: originalPost._id,
      originalUserId: originalPost.userId
    });

    const populatedRepost = await Post.findById(repost._id)
      .populate('userId', 'username profilePictureURL')
      .populate('originalUserId', 'username profilePictureURL');
    
    res.status(201).json(populatedRepost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
