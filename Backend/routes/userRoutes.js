const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const {isProfileOwner, authenticateToken} = require('../middleware');


router.route('/register')
    .post(catchAsync(users.register)); 

router.route('/login')
    .post(catchAsync(users.login)); 

router.get('/dashboard', authenticateToken, catchAsync(users.renderDashboard));

router.route('/profile')
    .get(authenticateToken, isProfileOwner, catchAsync(users.getProfile))
    .delete(authenticateToken, isProfileOwner, catchAsync(users.deleteProfile)); 

router.get('/logout', authenticateToken, users.logout);

module.exports = router;
