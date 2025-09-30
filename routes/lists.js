const express = require('express');
const { protect } = require('../middleware/auth');
const {
  upload,
  uploadList,
  getLists,
  getListById
} = require('../controllers/listController');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// Routes
router.post('/upload', upload.single('file'), uploadList);
router.get('/', getLists);
router.get('/:id', getListById);

module.exports = router;