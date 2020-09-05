const {Schema, model} = require('mongoose');
const ObjectId = Schema.ObjectId;

const CommentSchema = Schema(
{
  post_id: { type: ObjectId },
  email: { type: String },
  name: { type: String },
  gravatar: { type: String },
  comment: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = model('Comment', CommentSchema);