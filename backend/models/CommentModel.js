const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    parentId: {type: Schema.Types.ObjectId, ref: 'comments', default: null}

    // parentId: {type: Schema.Types.ObjectId, ref: 'comments', default: null}, // Parent comment reference
    // postId: {type: Schema.Types.ObjectId, ref: 'posts', required: true}, // Associated post
});

module.exports = mongoose.model('comments', CommentSchema);
