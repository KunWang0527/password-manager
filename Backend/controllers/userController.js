const User = require('../models/User');

exports.renderRegister = (req, res) => {
    res.render('users/register'); 
};

exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        
        // Log the user in after successful registration
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to the Password Manager!');
            res.redirect('/dashboard'); 
        });
    } catch (e) {
        req.flash('error', e.message); 
        res.redirect('register');
    }
};

exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/dashboard';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

exports.renderDashboard = (req, res) => {
    res.render('users/dashboard');
}

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


module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/home');
}
