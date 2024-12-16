const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//! TODO: dodaj report
const PostSchema = new Schema({
  title: { type: String, required: true },

  content: { type: String, required: true },
  category: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
    upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  upvoteUsers: [
    {
      type: String, // Hranjenje uporabniških imen
    },
  ],
  downvoteUsers: [
    {
      type: String, // Hranjenje uporabniških imen
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comments',
    },
  ],
  // reports: [
  //   {
  //     userId: { type: Schema.Types.ObjectId, ref: 'users' },
  //     reportedAt: { type: Date, default: Date.now },
  //     reason: { type: String },
  //   },
  // ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('posts', PostSchema);
