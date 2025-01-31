var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: { type: String, required: true },
  photoPath: { type: String, required: false, default: null },

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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('posts', PostSchema);
