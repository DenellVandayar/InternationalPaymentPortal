const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EmployeeSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// password hashing for employees for security
EmployeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('Employee', EmployeeSchema);