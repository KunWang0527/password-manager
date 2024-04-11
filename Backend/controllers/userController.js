const User = require('../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');



exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

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

        const token = jwt.sign(
            { userId: user._id, username: user.username }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.json({
            message: 'Login successful',
            user: { 
                username: user.username, 
                email: user.email 
            },
            token 
        });
    })(req, res, next);
};

exports.renderDashboard = async (req, res) => {
    try {
        const userData = {/* Fetch user data */};
        res.json(userData);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dashboard data.' });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); 
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


exports.logout = (req, res) => {
    req.logout();
    res.json({ message: "You've been logged out successfully." });
};
