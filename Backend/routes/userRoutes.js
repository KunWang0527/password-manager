const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isProfileOwner} = require('../middleware/authMiddleware');


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register)); 

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/dashboard', isLoggedIn, catchAsync(dashboardController.renderDashboard));

router.route('/profile')
    .get(isLoggedIn, isProfileOwner, catchAsync(usersController.getProfile))
    .delete(isLoggedIn, isProfileOwner, catchAsync(usersController.deleteProfile)); 

router.get('/logout', userController.logout);

module.exports = router;
