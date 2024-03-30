const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const passwordEntrySchema = new Schema({
  website: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
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

passwordEntrySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); 
  
  try {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
      next();
  } catch (error) {
      next(error);
  }
});

module.exports = mongoose.model('PasswordEntry', passwordEntrySchema);
