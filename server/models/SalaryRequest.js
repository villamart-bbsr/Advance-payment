import mongoose from 'mongoose';

const salaryRequestSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  designation: {
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
  date: {
    type: Date,
    required: true
  },
  amountPaid: {
    type: Number,
    default: 0
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
