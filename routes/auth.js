const express = require('express');
const { body } = require('express-validator');
const { loginUser, registerUser } = require('../controllers/authController');

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Routes
router.post('/login', loginValidation, loginUser);
router.post('/register', registerValidation, registerUser);

module.exports = router;