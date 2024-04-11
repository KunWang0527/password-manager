const express = require('express');
const router = express.Router();
const passwordEntriesController = require('../controllers/passwordEntryController');
const { isLoggedIn, isEntryOwner, authenticateToken } = require('../middleware');
const catchAsync = require('../utils/catchAsync');


router.post('/', authenticateToken, catchAsync(passwordEntriesController.createPasswordEntry));

router.get('/', authenticateToken, catchAsync(passwordEntriesController.getPasswordEntries));

router.post('/:id/share', authenticateToken, isEntryOwner, catchAsync(passwordEntriesController.sharePasswordEntry));

router.post('/:id/share-request', authenticateToken, isEntryOwner, catchAsync(passwordEntriesController.sendShareRequest));

router.post('/share-all', authenticateToken, catchAsync(passwordEntriesController.shareAllPasswordEntries));

router.post('/:id/accept-share', authenticateToken, catchAsync(passwordEntriesController.acceptShareRequest));

router.post('/:id/reject-share', authenticateToken, catchAsync(passwordEntriesController.rejectShareRequest));

router.post('/:id/revoke-access', authenticateToken, isEntryOwner, catchAsync(passwordEntriesController.revokeAccess));

router.post('/revoke-all-access', authenticateToken, catchAsync(passwordEntriesController.revokeAllAccess));

router.put('/:id', authenticateToken, isEntryOwner, catchAsync(passwordEntriesController.updatePasswordEntry));

router.delete('/:id', authenticateToken, isEntryOwner, catchAsync(passwordEntriesController.deletePasswordEntry));

module.exports = router;
