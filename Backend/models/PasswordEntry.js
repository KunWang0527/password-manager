const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordEntrySchema = new Schema({
    website: { type: String, required: true },
    username: { type: String },
    password: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('PasswordEntry', passwordEntrySchema);
