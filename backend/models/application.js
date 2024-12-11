// Load required packages
var mongoose = require('mongoose');

// Define our application schema
var ApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        default: true
    },
    status: {
        type: String,
        default: "pending"
    },
    webpage: {
        type: String,
        default: ""
    },
    notes: {
        type: String,
        default: ""
    },
    assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Application', ApplicationSchema);