import mongoose from 'mongoose';

const salaryRequestSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  amountRequested: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  amountPaidDate: {
    type: Date,
    default: null
  },
  modeOfPayment: {
    type: String,
    enum: ['Bank Transfer', 'Cash', 'Online'],
    default: null
  },
  adjustMonth: {
    type: String,
    default: null
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const SalaryRequest = mongoose.model('SalaryRequest', salaryRequestSchema);

export default SalaryRequest;
