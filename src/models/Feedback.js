const mongoose = require ("mongoose");
const schema = mongoose.Schema;
const { v4: uuidv4 } = require ('uuid');


const feedbackSchema = new schema({
  feedbackId: {
    type: String, 
    default: uuidv4, 
    unique: true 
  },

  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  
});


const FeedBack = mongoose.model('FeedBack', feedbackSchema);

module.exports = FeedBack;