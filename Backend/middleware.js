const { userSchema, passwordEntrySchema } = require('./schemas.js');
const PasswordEntry = require('../models/PasswordEntry'); 
const User = require('../models/User'); 


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isEntryOwner = async (req, res, next) => {
    const { id } = req.params; 
    try {
        const passwordEntry = await PasswordEntry.findById(id);
        if (!passwordEntry) {
            req.flash('error', 'Password entry does not exist!');
            return res.redirect('/passwordEntries');
        }
        if (passwordEntry.user.equals(req.user._id)) {
            return next();
        } else {
            req.flash('error', 'You do not have permission to do this!');
            return res.redirect('/passwordEntries');
        }
    } catch (error) {
        console.error('Checking entry ownership failed', error);
        req.flash('error', 'Error checking password entry ownership.');
        return res.redirect('/passwordEntries');
    }
};

module.exports.isProfileOwner = (req, res, next) => {
    const { userId } = req.params; 
    if (req.user._id.equals(userId)) {
        return next();
    } else {
        req.flash('error', 'You do not have permission to access this profile!');
        return res.redirect('/users/profile');
    }
};