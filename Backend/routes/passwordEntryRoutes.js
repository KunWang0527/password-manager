const express = require('express');
const router = express.Router();
const passwordEntriesController = require('../controllers/passwordEntryController');
const { isLoggedIn, isEntryOwner } = require('../middleware/authMiddleware');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, catchAsync(passwordEntriesController.createPasswordEntry));

router.get('/', isLoggedIn, catchAsync(passwordEntriesController.getPasswordEntries));

router.post('/:id/share', isLoggedIn, isEntryOwner, catchAsync(passwordEntriesController.sharePasswordEntry));

router.post('/:id/share-request', isLoggedIn, isEntryOwner, catchAsync(passwordEntriesController.sendShareRequest));

router.post('/share-all', isLoggedIn, catchAsync(passwordEntriesController.shareAllPasswordEntries));

router.post('/:id/accept-share', isLoggedIn, catchAsync(passwordEntriesController.acceptShareRequest));

router.post('/:id/reject-share', isLoggedIn, catchAsync(passwordEntriesController.rejectShareRequest));

router.post('/:id/revoke-access', isLoggedIn, isEntryOwner, catchAsync(passwordEntriesController.revokeAccess));

router.post('/revoke-all-access', isLoggedIn, catchAsync(passwordEntriesController.revokeAllAccess));

router.put('/:id', isLoggedIn, isEntryOwner, catchAsync(passwordEntriesController.updatePasswordEntry));

router.delete('/:id', isLoggedIn, isEntryOwner, catchAsync(passwordEntriesController.deletePasswordEntry));

module.exports = router;
