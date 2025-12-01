import Post from '../models/Post.js';
import User from '../models/User.js';

// Version without Cloudinary - stores images as base64
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let imageURL = '';

    if (req.file) {
      // Convert image to base64 for local storage
      const base64Image = req.file.buffer.toString('base64');
      imageURL = `data:${req.file.mimetype};base64,${base64Image}`;
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
      .populate('originalUserId', 'username profilePictureURL')
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
      .populate('originalUserId', 'username profilePictureURL')
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
      .populate('originalUserId', 'username profilePictureURL')
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

export const repostPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Create a new post as a repost
    const repost = await Post.create({
      userId: req.userId,
      text: req.body.text || post.text,
      imageURL: post.imageURL,
      originalPostId: post._id,
      originalUserId: post.userId
    });

    const populatedRepost = await Post.findById(repost._id)
      .populate('userId', 'username profilePictureURL')
      .populate('originalUserId', 'username profilePictureURL');

    res.status(201).json(populatedRepost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
