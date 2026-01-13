const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CustomerSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    idNumber: { type: String, required: true, unique: true },
    accountNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});


//  function securely hashes the password so we never save it as plain text.
CustomerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('Customer', CustomerSchema);