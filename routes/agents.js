const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getAgents,
  createAgent,
  updateAgent,
  deleteAgent
} = require('../controllers/agentController');

const router = express.Router();

// Validation rules for agent creation
const agentValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('mobile')
    .matches(/^\+[1-9]\d{1,14}$/)
    .withMessage('Please provide a valid mobile number with country code (e.g., +1234567890)'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Apply authentication middleware to all routes
router.use(protect);

// Routes
router.route('/')
  .get(getAgents)
  .post(agentValidation, createAgent);

router.route('/:id')
  .put(updateAgent)
  .delete(deleteAgent);

module.exports = router;