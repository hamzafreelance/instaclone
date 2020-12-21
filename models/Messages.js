const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    chat: {
        type: Schema.Types.ObjectId,
        ref: 'chat',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    message: [{
        type: String,
        required: true
    }],
    created_at: {
        type: Date,
        default: Date.now()
    }
}); 

module.exports = Messages = mongoose.model('messages', MessagesSchema);

