const express = require('express');
const router = express.Router();


const { isAuth, isEmployee } = require('../middleware/authMiddleware');

const {
    createTransaction,
    getPendingTransactions,
    verifyTransaction,
    submitVerifiedTransactions,
    rejectTransaction,
    getMyTransactions
} = require('../controllers/transactionController');


router.post('/', isAuth, createTransaction);

router.get('/pending', [isAuth, isEmployee], getPendingTransactions);

router.patch('/:id/verify', [isAuth, isEmployee], verifyTransaction);

router.post('/submit', [isAuth, isEmployee], submitVerifiedTransactions);

router.patch('/:id/reject', [isAuth, isEmployee], rejectTransaction);

router.get('/my-transactions', isAuth, getMyTransactions);

module.exports = router;