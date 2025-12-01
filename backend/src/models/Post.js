import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 500
  },
  imageURL: {
    type: String,
    default: ''
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  originalPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  originalUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

postSchema.index({ userId: 1 });
postSchema.index({ createdAt: -1 });

export default mongoose.model('Post', postSchema);
