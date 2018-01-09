const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchSchema = new Schema({
  keywords: String,
  date: Date
},
{
  timestamps: true
});

const Model = mongoose.model('search', searchSchema);
module.exports = Model;