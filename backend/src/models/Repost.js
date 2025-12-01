import mongoose from 'mongoose';

const repostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

repostSchema.index({ userId: 1, postId: 1 }, { unique: true });
repostSchema.index({ createdAt: -1 });

export default mongoose.model('Repost', repostSchema);
