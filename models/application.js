// Load required packages
var mongoose = require('mongoose');

// Define our application schema
var ApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Company: {
        type: String,
        default: ""
    },
    Status: {
        type: String,
        default: ""
    },
    Notes: {
        type: String,
        default: ""
    },
    assignedUser: {
        type: String,
        default: ""
    },
    assignedUserName: {
        type: String,
        default: "unassigned"
    },
    dataCreated: {
        type: Date,
        default: Date.now
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Application', ApplicationSchema);