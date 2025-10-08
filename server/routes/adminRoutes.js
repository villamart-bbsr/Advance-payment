import express from 'express';
import User from '../models/User.js';
import SalaryRequest from '../models/SalaryRequest.js';
import xlsx from 'xlsx';

const router = express.Router();

// Admin login
router.post('/login', (req, res) => {
  const { adminKey } = req.body;
  
  if (adminKey === process.env.ADMIN_KEY) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin key' });
  }
});

// Add new user
router.post('/add-user', async (req, res) => {
  try {
    const { name, designation, department, location } = req.body;
    
    if (!name || !designation || !department || !location) {
      return res.status(400).json({ success: false, message: 'Name, designation, department, and location are required' });
    }
    
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const user = new User({ name, designation, department, location });
    await user.save();
    
    res.status(201).json({ success: true, message: 'User added successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ name: 1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Get all salary records with optional date filters
router.get('/salary-records', async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;
    let query = {};
    
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        query.date.$lte = endDate;
      }
    }
    
    const records = await SalaryRequest.find(query).sort({ date: -1 });
    
    // Calculate total amount requested
    const totalAmount = records.reduce((sum, record) => sum + record.amountRequested, 0);
    
    res.json({ success: true, records, totalAmount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Update payment for a salary request
router.put('/update-payment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amountPaid } = req.body;
    
    if (!amountPaid || amountPaid < 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }
    
    const record = await SalaryRequest.findByIdAndUpdate(
      id,
      { amountPaid, isPaid: true },
      { new: true }
    );
    
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    
    res.json({ success: true, message: 'Payment updated successfully', record });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// Export salary records to Excel
router.post('/export-excel', async (req, res) => {
  try {
    const { fromDate, toDate } = req.body;
    let query = {};
    
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);
        query.date.$lte = endDate;
      }
    }
    
    const records = await SalaryRequest.find(query).sort({ date: -1 });
    
    // Prepare data for Excel
    const excelData = records.map(record => ({
      'User Name': record.userName,
      'Designation': record.designation,
      'Department': record.department,
      'Location': record.location,
      'Amount Requested': record.amountRequested,
      'Date': new Date(record.date).toLocaleDateString(),
      'Amount Paid': record.amountPaid || 0,
      'Payment Status': record.isPaid ? 'Paid' : 'Pending'
    }));
    
    // Add total row
    const totalAmount = records.reduce((sum, record) => sum + record.amountRequested, 0);
    excelData.push({
      'User Name': '',
      'Designation': '',
      'Department': '',
      'Location': '',
      'Amount Requested': totalAmount,
      'Date': 'TOTAL',
      'Amount Paid': '',
      'Payment Status': ''
    });
    
    // Create worksheet and workbook
    const ws = xlsx.utils.json_to_sheet(excelData);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Salary Records');
    
    // Generate buffer
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Send file
    res.setHeader('Content-Disposition', 'attachment; filename=salary_records.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;
