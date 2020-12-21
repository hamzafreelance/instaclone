const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowersSchema = new Schema({
  user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ]
});

module.exports = Followers = mongoose.model('followers', FollowersSchema);
