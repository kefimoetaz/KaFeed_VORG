import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 300
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

commentSchema.index({ postId: 1 });

export default mongoose.model('Comment', commentSchema);
