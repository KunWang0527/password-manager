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

router.route('/profile')
    .get(authenticateToken, catchAsync(users.getProfile))
    .delete(authenticateToken, catchAsync(users.deleteProfile)); 

router.put('/profile/username', authenticateToken, catchAsync(users.updateUsername));

router.put('/profile/password', authenticateToken, catchAsync(users.updatePassword));

router.get('/logout', authenticateToken, catchAsync(users.logout));

module.exports = router;
