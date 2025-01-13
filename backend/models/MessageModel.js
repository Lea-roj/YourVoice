var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true },
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'chats',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    datetime:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('messages', MessageSchema);