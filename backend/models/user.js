// Load required packages
var mongoose = require('mongoose');
const { ApplicationSchema } = require('./application'); 

// Define our user schema
var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }],
    goals: [{
        targetNumber: {
            type: Number,
            required: true
        },
        timeframe: {
            type: String,
            enum: ['daily', 'weekly', 'biweekly', 'monthly'],
            required: true
        },
        type: { // NOTE: this could be omitted
            type: String,
            enum: ['applications', 'interviews'], 
            required: true
        },
        startDate: {
            type: Date,
            default: Date.now
        },
        endDate: {
            type: Date,
            required: true
        },
        currentProgress: {
            type: Number,
            default: 0
        }
    }],
    statistics: {
        totalApplications: {
            type: Number,
            default: 0
        },
        totalInterviews: {
            type: Number,
            default: 0
        },
        totalRejections: {
            type: Number,
            default: 0
        },
        totalAcceptances: {
            type: Number,
            default: 0
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);