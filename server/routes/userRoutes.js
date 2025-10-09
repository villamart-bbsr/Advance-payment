import express from 'express';
import User from '../models/User.js';
import SalaryRequest from '../models/SalaryRequest.js';
import { sendAdvanceRequestEmail } from '../utils/emailService.js';

const router = express.Router();

// Submit advance salary request
router.post('/request', async (req, res) => {
  try {
    const { userName, department, location, amountRequested, reason, date } = req.body;
    
    if (!userName || !department || !location || !amountRequested || !reason || !date) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    
    const salaryRequest = new SalaryRequest({
      userName,
      department,
      location,
      amountRequested,
      reason,
      date
    });
    
    await salaryRequest.save();
    
    // Send email notification
    const emailResult = await sendAdvanceRequestEmail({
      userName,
      amountRequested,
      reason,
      date
    });
    
    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
      // Continue anyway - don't fail the request if email fails
    }
    
    res.status(201).json({ success: true, message: 'Request submitted successfully', salaryRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get user's salary requests by name
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    
    // Get user details
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Get all requests for this user
    const requests = await SalaryRequest.find({ userName: name }).sort({ date: -1 });
    
    res.json({ success: true, user, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get user by name (for auto-filling designation)
router.get('/details/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const user = await User.findOne({ name });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;
