const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const Customer = require("../models/Customer");

const {
  registerCustomer,
  loginCustomer,
  loginEmployee,
} = require("../controllers/authController");

// --- South African ID validation helper ---
const isValidSaId = (idNumber) => {
  if (!/^\d{13}$/.test(idNumber)) return false;

  const year = idNumber.substring(0, 2);
  const month = idNumber.substring(2, 4);
  const day = idNumber.substring(4, 6);
  const currentCentury = new Date().getFullYear().toString().substring(0, 2);
  const fullYear =
    parseInt(year) < new Date().getFullYear() % 100
      ? `${currentCentury}${year}`
      : `${parseInt(currentCentury) - 1}${year}`;

  const dob = new Date(fullYear, parseInt(month) - 1, day);

  return (
    dob.getFullYear() === parseInt(fullYear) &&
    dob.getMonth() === parseInt(month) - 1 &&
    dob.getDate() === parseInt(day)
  );
};

// --- Customer Registration Validation ---
const registerValidationRules = [
  body("fullName")
    .matches(/^[A-Za-z\u00C0-\u017F'\s-]+$/)
    .withMessage("Full name contains invalid characters"),
  body("idNumber")
    .custom(isValidSaId)
    .withMessage("Please provide a valid 13-digit South African ID number"),
  body("accountNumber")
    .isNumeric({ no_symbols: true })
    .withMessage("Account number must only contain digits")
    .isLength({ min: 7, max: 11 })
    .withMessage("Account number must be between 7 and 11 digits")
    .custom(async (value) => {
      const existing = await Customer.findOne({ accountNumber: value });
      if (existing) return Promise.reject("An account with this number already exists.");
    }),
  body("password")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage(
      "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
    ),
];

// --- Customer Login Validation ---
const loginValidationRules = [
  body("accountNumber")
    .isNumeric({ no_symbols: true })
    .withMessage("Account number must only contain digits")
    .isLength({ min: 7, max: 11 })
    .withMessage("Invalid account number length"),
  body("password").notEmpty().withMessage("Password is required"),
];

// --- Employee Login Validation ---
const employeeLoginValidationRules = [
  body("username")
    .isString()
    .trim()
    .matches(/^[A-Za-z0-9_]+$/)
    .withMessage("Username must contain only letters, numbers, or underscores"),
  body("password").notEmpty().withMessage("Password is required"),
];

// --- Routes ---
router.post("/register/customer", registerValidationRules, registerCustomer);
router.post("/login/customer", loginValidationRules, loginCustomer);
router.post("/login/employee", employeeLoginValidationRules, loginEmployee);

module.exports = router;