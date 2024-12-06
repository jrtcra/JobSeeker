// Load required packages
var mongoose = require('mongoose');
const { ApplicationSchema } = require('./application'); 

// Define our user schema
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    pendingApps: {
        type: [ApplicationSchema],
        default: []
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);