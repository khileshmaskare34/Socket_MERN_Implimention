const mongoose = require('mongoose');

const clockSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'labeler',
        required: true,
    },
    clockInTime: {
        type: Date,
        required: true,
    },
    clockOutTime: {
        type: Date,
        default: null, // Initially null until the user clocks out
    },
    breaks: [{
        breakStartTime: { type: Date },
        breakEndTime: { type: Date },
    }],
    
    date: {
        type: Date,
        required: true,
        default: function() {
            return new Date(new Date().setHours(0, 0, 0, 0)); // Automatically sets to the current date (midnight)
        },
    },
    status: {
        type: String
    }
});

clockSchema.methods.isClockedOut = function () {
    return this.clockOutTime !== null;
};

const Clock = mongoose.model('Clock', clockSchema);

module.exports = Clock;
