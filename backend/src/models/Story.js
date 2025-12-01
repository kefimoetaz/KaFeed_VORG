import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageURL: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Stories expire after 24 hours
  }
});

storySchema.index({ userId: 1 });
storySchema.index({ createdAt: -1 });

export default mongoose.model('Story', storySchema);
