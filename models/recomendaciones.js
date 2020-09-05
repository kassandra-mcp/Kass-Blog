const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const RecomendacionSchema = Schema(
{
  title: String,
  description: String,
  autor: String,
  Twitter: String,
  Facebook: String,
  Youtube: String,
  Instagram: String,
  Spotify: String,
  Link: String,
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  date: {type: Date, default: Date.now},
  timestamp: { type: Date, default: Date.now }

});

module.exports = mongoose.model('recoms', RecomendacionSchema);