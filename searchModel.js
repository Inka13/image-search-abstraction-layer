const mongoose = ("mongoose");
const Schema = mongoose.Schema;

const searchSchema = new Schema({
  keywords: String,
  date: Date
},
{
  timestamps: true
});

const searchModel = mongoose.model('search', searchSchema);
module.exports = searchModel;