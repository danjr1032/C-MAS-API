const mongoose = require('mongoose');
const Report = require('../models/Report');
const { v4: uuidv4 } = require ('uuid');
const Schema = mongoose.Schema;


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema({
    userID: {
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
        required: true,
        unique: true,
        // Custom validation function using a regular expression
        validate: {
            validator: function(v) {
                return emailRegex.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        }
    },
    phone: {
        type: Number,
        required: true,
        unique: false
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    street: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    nationality: {
        type: String,
        required: false
    },
    isAdmin: {
        type: Boolean,
        default: false 
    },
    
    reports: [{
        type: Schema.Types.ObjectId,
        ref: 'Report'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
