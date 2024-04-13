const ShareRequest = require('../models/ShareRequest'); 
const User = require('../models/User'); 
const PasswordEntry = require('../models/PasswordEntry');



// Create a new share request
exports.createShareRequest = async (req, res) => {
    const fromUser = req.user.userId;  // ID of the user creating the share request
    const passwordEntryId = req.params.id;  // ID from the URL
    const { emailToShareWith } = req.body;  // Email from the request body


    try {
        if (!emailToShareWith) {
            return res.status(400).json({ message: "Email is required to share a password entry." });
        }

        // Find the user by email to whom the password will be shared
        const toUser = await User.findOne({ email: emailToShareWith });
        if (!toUser) {
            return res.status(404).json({ message: "User not found with provided email." });
        }

        if (toUser._id.toString() === fromUser) {
            return res.status(400).json({ message: "Cannot share with yourself." });
        }

        // Find the password entry by ID
        const passwordEntry = await PasswordEntry.findById(passwordEntryId);
        if (!passwordEntry) {
            return res.status(404).json({ message: "Password entry not found." });
        }

        // Create and save the new share request
        const newRequest = new ShareRequest({
            fromUser,
            toUser: toUser._id,
            passwordEntry: passwordEntry._id
        });
        await newRequest.save();

        res.status(201).json({
            message: 'Share request created successfully.',
            shareRequest: {
                id: newRequest._id,
                fromUser: fromUser,
                toUser: toUser._id,
                passwordEntry: passwordEntry._id
            }
        });
    } catch (error) {
        console.error(`Failed to create share request: ${error}`);
        res.status(500).json({ message: "Failed to create share request", error: error.message });
    }
};

// Get all share requests
exports.getAllShareRequests = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const requests = await ShareRequest.find({ toUser: userId })
                                           .populate('fromUser', 'username email')
                                           .populate('toUser', 'username email')
                                           .populate('passwordEntry', 'website username');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve share requests", error: error.message });
    }
};

// Get a single share request by ID
exports.getShareRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await ShareRequest.findById(id)
                                          .populate('fromUser', 'username email')
                                          .populate('toUser', 'username email')
                                          .populate('passwordEntry');
        if (!request) {
            return res.status(404).json({ message: "Share request not found" });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve share request", error: error.message });
    }
};

// Update a share request's status
exports.updateShareRequest = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Assume only status can be updated
    try {
        const request = await ShareRequest.findByIdAndUpdate(id, { status }, { new: true })
                                            .populate('fromUser', 'username email')
                                            .populate('toUser', 'username email')
                                            .populate('passwordEntry');
        if (!request) {
            return res.status(404).json({ message: "Share request not found" });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: "Failed to update share request", error: error.message });
    }
};

// Delete a share request
exports.deleteShareRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRequest = await ShareRequest.findByIdAndDelete(id);
        if (!deletedRequest) {
            return res.status(404).json({ message: "Share request not found" });
        }
        res.status(200).json({ message: "Share request deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete share request", error: error.message });
    }
};

exports.acceptShareRequest = async (req, res) => {
    const { id } = req.params; 

    try {
        const shareRequest = await ShareRequest.findById(id);
        if (!shareRequest) {
            return res.status(404).json({ message: 'Share request not found' });
        }

        if (shareRequest.status === 'accepted') {
            return res.status(400).json({ message: 'Request already accepted' });
        }

        shareRequest.status = 'accepted';
        await shareRequest.save();
        
        res.json({ message: 'Share request accepted successfully' });
    } catch (error) {
        console.error('Failed to accept share request:', error);
        res.status(500).json({ message: 'Failed to accept share request', error: error.message });
    }
};


exports.rejectShareRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await ShareRequest.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
        if (!request) {
            return res.status(404).json({ message: 'Share request not found' });
        }
        res.json({ message: 'Share request rejected', request });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reject share request', error: error.message });
    }
};
