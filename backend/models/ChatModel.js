var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChatSchema = new Schema({
    user1: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        username: {
            type: Schema.Types.String,
            required: true
        },
    },
    user2: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        username: {
            type: Schema.Types.String,
            required: true
    },
    },
});

module.exports = mongoose.model('chats', ChatSchema);