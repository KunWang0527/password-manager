const { userSchema, passwordEntrySchema } = require('./schemas');
const ShareRequest = require('./models/ShareRequest');
const PasswordEntry = require('./models/PasswordEntry'); 
const User = require('./models/User'); 
const jwt = require('jsonwebtoken');


// Middleware to check if the logged-in user is the owner of the share request
module.exports.isRequestOwner = async (req, res, next) => {
    const { id } = req.params;
    try {
        const shareRequest = await ShareRequest.findById(id);
        if (!shareRequest) {
            return res.status(404).json({ message: 'Share request not found' });
        }
        
        if (shareRequest.fromUser.toString() === req.user.userId) {
            next();
        } else {
            res.status(403).json({ message: 'You do not have permission to perform this action' });
        }
    } catch (error) {
        console.error('Error checking request ownership:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.isTargetUser = async (req, res, next) => {
    const { id } = req.params; 

    if (!req.user) {
        return res.status(403).json({ message: 'Authentication required.' });
    }

    try {
        const shareRequest = await ShareRequest.findById(id);
        if (!shareRequest) {
            return res.status(404).json({ message: 'Share request not found.' });
        }


        if (shareRequest.toUser.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Access denied. You are not the recipient of this share request.' });
        }

        next(); 
    } catch (error) {
        console.error('Error verifying share request recipient:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
};


module.exports.isEntryOwner = async (req, res, next) => {
    const { id } = req.params;
    try {
        const passwordEntry = await PasswordEntry.findById(id);
        if (!passwordEntry) {
            return res.status(404).json({ error: 'Password entry does not exist!' });
        }
        if (passwordEntry.user.toString() === req.user.userId.toString()) {
            return next();
        } else {
            return res.status(403).json({ error: 'You do not have permission to do this!' });
        }
    } catch (error) {
        console.error('Checking entry ownership failed', error);
        return res.status(500).json({ error: 'Error checking password entry ownership.' });
    }
};


module.exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};
