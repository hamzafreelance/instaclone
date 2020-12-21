const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    to: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = Chat = mongoose.model('chat', ChatSchema);