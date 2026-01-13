const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Employee = require("../models/Employee");

// Helper to sign JWT
const signToken = (userId, role) => {
  return jwt.sign(
    { user: { id: userId, role } },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// --- Register Customer ---
exports.registerCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullName, idNumber, accountNumber, password } = req.body;

  try {
    const existing = await Customer.findOne({ accountNumber });
    if (existing) {
      return res.status(400).json({ msg: "A customer with that account number already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = new Customer({
      fullName,
      idNumber,
      accountNumber,
      password: hashedPassword,
    });

    await customer.save();

    // Optionally return a JWT after registration
    const token = signToken(customer.id, "customer");

    res.status(201).json({ msg: "Customer registered successfully", token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// --- Customer Login ---
exports.loginCustomer = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { accountNumber, password } = req.body;

  try {
    const customer = await Customer.findOne({ accountNumber });
    if (!customer) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = signToken(customer.id, "customer");
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// --- Employee Login ---
exports.loginEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { username, password } = req.body;

  try {
    const employee = await Employee.findOne({ username });
    if (!employee) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = signToken(employee.id, "employee");
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};