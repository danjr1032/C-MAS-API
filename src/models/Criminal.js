const mongoose = require('mongoose');
const { v4: uuidv4 } = require ('uuid');
const Schema = mongoose.Schema;

const criminalSchema = new Schema({
    criminalId: {
        type: String, 
        default: uuidv4, 
        unique: true 
    },
    image: {
        type: String,
        required: true,
        default: " "
    },
    fullname: {
        type: String,
        required: true,
        min: 5,
        max: 35
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    DOB: {
        type: String,
        required: true,
    },
    occupation : {
        required: true,
        type: String,
    },
    maritalStatus : {
        type: String,
        required: true,
        default:"Single",
        enum:["Married", "Single", "Divorced"]
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    eyeColor: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    localGovernment: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    crime: {
        type: String,
        required: true,
        enum:["Robbery","Murder","Sexual Assault","Cybercrime","Kidnapping"],
    },
    contactFullname: {
        type: String,
        required: true,
        default:" "
    },
    contactNumber : {
        type: String,
        required: true,
        default:" "
    },
    contactaddress:{
        type: String,
        required: true,
        default:" "
    },
    contactRelationship:{
        type: String,
        required: true,
        default:" "
    },
    dateCommitted: {
        type: String,
        required: true,
        default:" "
    },
    dateConvicted: {
        type: String,
        required: true,
        default: " "
    },
    sentence: {
        type: String,
        required: true,
        default:" "
    },
    
});

const Criminal = mongoose.model('Criminal', criminalSchema);

module.exports = Criminal;
