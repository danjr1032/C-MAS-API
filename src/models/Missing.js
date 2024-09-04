const mongoose = require('mongoose');
const { v4: uuidv4 } = require ('uuid');
const Schema = mongoose.Schema;

const missingSchema = new Schema({
    missingID: {
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
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'male','Female', 'female','Other', 'other'],
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    cloudinary_id:{
        type: String
    },
    
});

const Missing = mongoose.model('Missing', missingSchema);

module.exports = Missing;
