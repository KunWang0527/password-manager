const express = require('express');
const router = express.Router();
const shareRequestController = require('../controllers/shareRequestController');
const { authenticateToken, isRequestOwner, isEntryOwner, isTargetUser } = require('../middleware');


router.get('/', authenticateToken, shareRequestController.getAllShareRequests);  
router.get('/pending', authenticateToken, shareRequestController.getPendingShareRequests);
router.get('/my-requests', authenticateToken, shareRequestController.getMyShareRequests);
router.get('/:id', authenticateToken, shareRequestController.getShareRequestById);
router.post('/:id/share', authenticateToken, shareRequestController.createShareRequest);  
router.put('/:id/pending', authenticateToken,  shareRequestController.setToPending);
router.put('/:id/revoked', authenticateToken,  shareRequestController.setToRevoked);
router.delete('/:id', authenticateToken, shareRequestController.deleteShareRequest); 
router.put('/:id/accept', authenticateToken, isTargetUser, shareRequestController.acceptShareRequest);
router.put('/:id/reject', authenticateToken, isTargetUser, shareRequestController.rejectShareRequest);


module.exports = router;
