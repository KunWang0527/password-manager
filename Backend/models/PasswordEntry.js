const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const passwordEntrySchema = new Schema({
  website: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shareRequests: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['rejected', 'pending', 'accepted'], default: 'pending' }
  }]
}, { timestamps: true });


module.exports = mongoose.model('PasswordEntry', passwordEntrySchema);
