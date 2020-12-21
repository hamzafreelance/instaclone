const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'posts'
    }],
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    picture: {
        type: String
    },
    following: [{
        type: Schema.Types.ObjectId
    }],
    followers: [{
        type: Schema.Types.ObjectId
    }],
    created_at: {
        type: Date,
        default: Date.now()
    }
});

module.exports = User = mongoose.model('users', UserSchema);