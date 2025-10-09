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
    const { name, department, location } = req.body;
    
    if (!name || !department || !location) {
      return res.status(400).json({ success: false, message: 'Name, department, and location are required' });
    }
    
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    const user = new User({ name, department, location });
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
    const { amountPaid, amountPaidDate, modeOfPayment, adjustMonth } = req.body;
    
    if (!amountPaid || amountPaid < 0) {
      return res.status(400).json({ success: false, message: 'Valid amount is required' });
    }
    
    const updateData = {
      amountPaid,
      isPaid: true
    };
    
    if (amountPaidDate) updateData.amountPaidDate = amountPaidDate;
    if (modeOfPayment) updateData.modeOfPayment = modeOfPayment;
    if (adjustMonth) updateData.adjustMonth = adjustMonth;
    
    const record = await SalaryRequest.findByIdAndUpdate(
      id,
      updateData,
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
    
    // If no date filter, group by date
    if (!fromDate && !toDate) {
      // Group records by date
      const groupedByDate = {};
      records.forEach(record => {
        const dateKey = new Date(record.date).toLocaleDateString();
        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = [];
        }
        groupedByDate[dateKey].push(record);
      });
      
      // Prepare data with date separators
      const excelData = [];
      let serialNumber = 1;
      
      Object.keys(groupedByDate).forEach(date => {
        // Add date header row
        excelData.push({
          'Serial Number': '',
          'User Name': `DATE: ${date}`,
          'Department': '',
          'Location': '',
          'Amount Requested': '',
          'Reason': '',
          'Date': '',
          'Amount Paid': '',
          'Amount Paid Date': '',
          'Mode of Payment': '',
          'Adjust Month': '',
          'Payment Status': ''
        });
        
        // Add records for this date
        groupedByDate[date].forEach(record => {
          excelData.push({
            'Serial Number': serialNumber++,
            'User Name': record.userName,
            'Department': record.department,
            'Location': record.location,
            'Amount Requested': record.amountRequested,
            'Reason': record.reason || 'N/A',
            'Date': new Date(record.date).toLocaleDateString(),
            'Amount Paid': record.amountPaid || 0,
            'Amount Paid Date': record.amountPaidDate ? new Date(record.amountPaidDate).toLocaleDateString() : 'N/A',
            'Mode of Payment': record.modeOfPayment || 'N/A',
            'Adjust Month': record.adjustMonth || 'N/A',
            'Payment Status': record.isPaid ? 'Paid' : 'Pending'
          });
        });
        
        // Add subtotal for this date
        const dateTotal = groupedByDate[date].reduce((sum, r) => sum + r.amountRequested, 0);
        const datePaidTotal = groupedByDate[date].reduce((sum, r) => sum + (r.amountPaid || 0), 0);
        excelData.push({
          'Serial Number': '',
          'User Name': '',
          'Department': '',
          'Location': '',
          'Amount Requested': dateTotal,
          'Reason': '',
          'Date': `Subtotal (${date})`,
          'Amount Paid': datePaidTotal,
          'Amount Paid Date': '',
          'Mode of Payment': '',
          'Adjust Month': '',
          'Payment Status': ''
        });
        
        // Add empty row for separation
        excelData.push({
          'Serial Number': '',
          'User Name': '',
          'Department': '',
          'Location': '',
          'Amount Requested': '',
          'Reason': '',
          'Date': '',
          'Amount Paid': '',
          'Amount Paid Date': '',
          'Mode of Payment': '',
          'Adjust Month': '',
          'Payment Status': ''
        });
      });
      
      // Add grand total row
      const totalAmountRequested = records.reduce((sum, record) => sum + record.amountRequested, 0);
      const totalAmountPaid = records.reduce((sum, record) => sum + (record.amountPaid || 0), 0);
      excelData.push({
        'Serial Number': '',
        'User Name': '',
        'Department': '',
        'Location': '',
        'Amount Requested': totalAmountRequested,
        'Reason': '',
        'Date': 'GRAND TOTAL',
        'Amount Paid': totalAmountPaid,
        'Amount Paid Date': '',
        'Mode of Payment': '',
        'Adjust Month': '',
        'Payment Status': ''
      });
      
      // Create worksheet and workbook
      const ws = xlsx.utils.json_to_sheet(excelData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Salary Records');
      
      // Generate buffer
      const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
      
      // Send file
      res.setHeader('Content-Disposition', 'attachment; filename=salary_records_all.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } else {
      // Specific date range - simple list
      const excelData = records.map((record, index) => ({
        'Serial Number': index + 1,
        'User Name': record.userName,
        'Department': record.department,
        'Location': record.location,
        'Amount Requested': record.amountRequested,
        'Reason': record.reason || 'N/A',
        'Date': new Date(record.date).toLocaleDateString(),
        'Amount Paid': record.amountPaid || 0,
        'Amount Paid Date': record.amountPaidDate ? new Date(record.amountPaidDate).toLocaleDateString() : 'N/A',
        'Mode of Payment': record.modeOfPayment || 'N/A',
        'Adjust Month': record.adjustMonth || 'N/A',
        'Payment Status': record.isPaid ? 'Paid' : 'Pending'
      }));
      
      // Add total row
      const totalAmountRequested = records.reduce((sum, record) => sum + record.amountRequested, 0);
      const totalAmountPaid = records.reduce((sum, record) => sum + (record.amountPaid || 0), 0);
      excelData.push({
        'Serial Number': '',
        'User Name': '',
        'Department': '',
        'Location': '',
        'Amount Requested': totalAmountRequested,
        'Reason': '',
        'Date': 'TOTAL',
        'Amount Paid': totalAmountPaid,
        'Amount Paid Date': '',
        'Mode of Payment': '',
        'Adjust Month': '',
        'Payment Status': ''
      });
      
      // Create worksheet and workbook
      const ws = xlsx.utils.json_to_sheet(excelData);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'Salary Records');
      
      // Generate buffer
      const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
      
      // Send file with date range in filename
      const filename = `salary_records_${fromDate || 'start'}_to_${toDate || 'end'}.xlsx`;
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

export default router;
