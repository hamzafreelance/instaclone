const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FollowingSchema = new Schema({
  user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
  },
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ]
});

module.exports = Following = mongoose.model('following', FollowingSchema);
