const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const TaskSchema = Schema(
{
  title: String,
  description: String,
  autor: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  date: {type: Date, default: Date.now},
  timestamp: { type: Date, default: Date.now }

});

module.exports = mongoose.model('tasks', TaskSchema);