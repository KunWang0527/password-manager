const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordEntrySchema = new Schema({
    website: { type: String, required: true },
    username: { type: String },
    password: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

passwordEntrySchema.pre('findOneAndDelete', async function(next) {
    const passwordEntry = this.getQuery()['_id'];
    try {
        // Delete all share requests associated with this password entry
        await mongoose.model('ShareRequest').deleteMany({ passwordEntry: passwordEntry });
        next();
    } catch (error) {
        next(error);
    }
});



module.exports = mongoose.model('PasswordEntry', passwordEntrySchema);
