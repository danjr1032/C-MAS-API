const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;

function validateEmail(email) {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  }

const policeSchema = new Schema({
    policeID: {
        type: String,
        default: uuidv4,
        unique: true
    },
    fullname:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
            validate: {
      validator: validateEmail,
      message: "Invalid email address",
    },
        match: [/\S+@\S+\.\S+/, 'Invalid email address'],
    },
    password:{
        type:String,
        required: true
    },
    rank: {
        type:String,
        required: true
    },
    gender: {
        type:String,
        required: true
    },
    bloodGroup:{
        type:String,
        required: true
    },
    DOB:{
        type:String,
        required: true
    },
    nextOfKin:{
        type:String,
        required: true
    },
    image: {
        type: String, 
        required: true,
    },
    badgeNumber: {
        type: String,
        required: true,
        unique: true
    },
    cloudinary_id:{
        type: String
    },
});

const Police = mongoose.model('Police', policeSchema);

module.exports = Police;
