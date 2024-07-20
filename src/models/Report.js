const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require ('uuid');

// const User = require('../models/User');

const reportSchema = new mongoose.Schema({
  userID: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reportId: {
    type: String, 
    default: uuidv4, 
    unique: true 
},
  crime: {
    type: String,
    required: true,
    enum:["Robbery","Murder","Sexual Assault","Cybercrime","Kidnapping"],
  },
  location: {
    type: String,
    required: true
  },
  description:{
    type: String,
    required: true
  },
  evidence: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'In Progress'
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;