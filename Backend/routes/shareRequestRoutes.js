const express = require('express');
const router = express.Router();
const shareRequestController = require('../controllers/shareRequestController');
const { authenticateToken, isRequestOwner, isEntryOwner, isTargetUser } = require('../middleware');

router.post('/:id/share', authenticateToken, isEntryOwner, shareRequestController.createShareRequest);  

router.get('/', authenticateToken, shareRequestController.getAllShareRequests);  
router.get('/:id', authenticateToken, shareRequestController.getShareRequestById);
router.put('/:id', authenticateToken, isEntryOwner, shareRequestController.updateShareRequest); 
router.delete('/:id', authenticateToken, isEntryOwner, shareRequestController.deleteShareRequest); 
router.put('/:id/accept', authenticateToken, isTargetUser, shareRequestController.acceptShareRequest);
router.put('/:id/reject', authenticateToken, isTargetUser, shareRequestController.rejectShareRequest);

module.exports = router;
