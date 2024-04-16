const User = require('../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');



exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: 'An account with this email already exists.' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          return res.status(400).json({ message: 'An account with this username already exists.' });
        }
        const newUser = new User({ email, username });

        User.register(newUser, password, async (err, user) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error registering new user.', error: err.message });
            }

            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' } 
            );

            res.status(201).json({
                message: 'Registration successful',
                user: { id: user._id, username: user.username, email: user.email },
                token
            });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ message: 'Failed to register user.', error: error.message });
    }
};

exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { 
            return next(err); 
        }
        if (!user) { 
            return res.status(400).json({ message: 'Username or password is incorrect' }); 
        }

        const tokenExpirySeconds = 3600; 
        const token = jwt.sign(
            { userId: user._id, username: user.username }, 
            process.env.JWT_SECRET,
            { expiresIn: tokenExpirySeconds } 
        );

        res.json({
            message: 'Login successful',
            user: { 
                username: user.username, 
                email: user.email 
            },
            token,
            tokenExpiry: new Date(new Date().getTime() + tokenExpirySeconds * 1000)
        });
    })(req, res, next);
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId); 
        res.json({ user: user.toObject({ getters: true, virtuals: false }) });
    } catch (error) {
        res.status(400).json({ error: 'Cannot find user.' });
    }
};


exports.deleteProfile = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user._id);
        
        req.session.destroy(err => {
            if (err) {
                return res.status(400).json({ error: 'Session could not be destroyed.' });
            }
            
            res.clearCookie('connect.sid'); 
            
            res.status(200).json({ message: 'Profile deleted. You have been logged out.', redirect: '/home' });
        });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting profile.' });
    }
};

exports.updateUsername = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: "Username is required." });
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.userId, { username }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ message: "Username updated successfully.", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Failed to update username.", error: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword) {
        return res.status(400).json({ message: "New password is required." });
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.setPassword(newPassword, async (error) => {
            if (error) {
                return res.status(500).json({ message: "Failed to update password.", error: error.message });
            }

            await user.save(); 
            res.json({ message: "Password updated successfully." });
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update password.", error: error.message });
    }
};

exports.logout = (req, res) => {
    req.logout();
    res.json({ message: "You've been logged out successfully." });
};
