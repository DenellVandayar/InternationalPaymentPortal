const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
    const { amount, currency, payeeAccountInfo, payeeSwiftCode } = req.body;

    try {
        const newTransaction = new Transaction({
            customer: req.user.id, 
            amount,
            currency,
            payeeAccountInfo,
            payeeSwiftCode
        });

        const transaction = await newTransaction.save();
        res.status(201).json(transaction);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getPendingTransactions = async (req, res) => {
    try {
        // Find all transactions where the status is 'Pending'
        const transactions = await Transaction.find({ status: 'Pending' }).populate('customer', ['fullName', 'accountNumber']);
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.verifyTransaction = async (req, res) => {
    try {
        // Find the transaction by the ID passed in the URL
        const transaction = await Transaction.findById(req.params.id);

        // Check if the transaction exists
        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }

        // Only allow verification if the transaction is still pending
        if (transaction.status !== 'Pending') {
            return res.status(400).json({ msg: 'Transaction is not pending and cannot be verified' });
        }

        // Update the status and record which employee verified it
        transaction.status = 'Verified';
        transaction.verifiedBy = req.user.id; // Get employee ID from the token

        await transaction.save();

        res.json(transaction); // Send back the updated transaction
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.submitVerifiedTransactions = async (req, res) => {
    try {
        const result = await Transaction.updateMany(
            { status: 'Verified' },
            { $set: { status: 'Submitted' } }
        );

        
        if (result.modifiedCount === 0) {
            return res.status(404).json({ msg: 'No verified transactions found to submit.' });
        }

        
        res.json({ msg: `Successfully submitted ${result.modifiedCount} transaction(s).` });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.rejectTransaction = async (req, res) => {
    const { rejectionReason } = req.body; // Get reason from request body
    if (!rejectionReason) {
        return res.status(400).json({ msg: 'Rejection reason is required' });
    }

    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ msg: 'Transaction not found' });
        }
        if (transaction.status !== 'Pending') {
            return res.status(400).json({ msg: 'Only pending transactions can be rejected' });
        }

        transaction.status = 'Rejected';
        transaction.rejectionReason = rejectionReason;
        transaction.verifiedBy = req.user.id; // Record employee who actioned it

        await transaction.save();
        res.json(transaction);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getMyTransactions = async (req, res) => {
  try {
    // Find transactions where the customer field matches the logged-in user's ID
    const transactions = await Transaction.find({ customer: req.user.id }).sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};