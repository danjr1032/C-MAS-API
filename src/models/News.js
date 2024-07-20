const mongoose = require("mongoose");
const { v4: uuidv4 } = require ('uuid');

const { Schema } = mongoose;

const newsSchema = new Schema({
  newsId: {
    type: String, 
    default: uuidv4, 
    unique: true 
},
  headline: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: "Admin"
  },
  publish_date: {
    type: Date,
    default: Date.now
  },
});

const News = mongoose.model("News", newsSchema);

module.exports = News;