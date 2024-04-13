const mongoose = require('mongoose');
const { Schema } = mongoose;

const shareRequestSchema = new Schema({
    fromUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    toUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    passwordEntry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PasswordEntry',
        required: true
    },
    status: {
        type: String,
        enum: ['rejected', 'pending', 'accepted'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('ShareRequest', shareRequestSchema);
