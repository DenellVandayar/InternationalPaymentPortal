const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    provider: { type: String, default: 'SWIFT' },
    payeeAccountInfo: { type: String, required: true },
    payeeSwiftCode: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Verified', 'Submitted', 'Rejected'], default: 'Pending' },
    createdAt: { type: Date, default: Date.now },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    rejectionReason: { type: String }
});

module.exports = mongoose.model('Transaction', TransactionSchema);