const List = require('../models/List');
const Agent = require('../models/Agent');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const xlsx = require('xlsx');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV, XLS, and XLSX files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Parse CSV file
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim().toLowerCase()
      }))
      .on('data', (data) => {
        // Validate required fields
        if (data.firstname && data.phone) {
          results.push({
            firstName: data.firstname.trim(),
            phone: data.phone.toString().trim(),
            notes: data.notes ? data.notes.trim() : ''
          });
        }
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

// Parse Excel file
const parseExcel = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);
    
    const results = [];
    
    jsonData.forEach((row) => {
      // Handle different possible column names
      const firstName = row.FirstName || row.firstname || row['First Name'] || '';
      const phone = row.Phone || row.phone || row.mobile || row.Mobile || '';
      const notes = row.Notes || row.notes || row.Note || row.note || '';
      
      if (firstName && phone) {
        results.push({
          firstName: firstName.toString().trim(),
          phone: phone.toString().trim(),
          notes: notes.toString().trim()
        });
      }
    });
    
    return results;
  } catch (error) {
    throw new Error('Error parsing Excel file: ' + error.message);
  }
};

// Distribute items among agents
const distributeItems = (items, agents) => {
  const distributions = [];
  const itemsPerAgent = Math.floor(items.length / agents.length);
  const remainder = items.length % agents.length;
  
  let currentIndex = 0;
  
  agents.forEach((agent, index) => {
    const itemCount = itemsPerAgent + (index < remainder ? 1 : 0);
    const agentItems = items.slice(currentIndex, currentIndex + itemCount);
    
    distributions.push({
      agent: agent._id,
      items: agentItems,
      itemCount: itemCount
    });
    
    currentIndex += itemCount;
  });
  
  return distributions;
};

// @desc    Upload and distribute CSV/Excel file
// @route   POST /api/lists/upload
// @access  Private
const uploadList = async (req, res) => {
  try {
    // Get active agents
    const agents = await Agent.find({ isActive: true });
    
    if (agents.length === 0) {
      return res.status(400).json({ message: 'No active agents found. Please add agents first.' });
    }
    
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileExtension = path.extname(fileName).toLowerCase();
    
    let parsedData;
    
    // Parse file based on type
    if (fileExtension === '.csv') {
      parsedData = await parseCSV(filePath);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      parsedData = parseExcel(filePath);
    } else {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Invalid file format' });
    }
    
    if (parsedData.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No valid data found in the file' });
    }
    
    // Distribute items among agents
    const distributions = distributeItems(parsedData, agents);
    
    // Create list document
    const list = await List.create({
      fileName: fileName,
      totalItems: parsedData.length,
      uploadedBy: req.user._id,
      distributions: distributions
    });
    
    // Populate agent details
    await list.populate('distributions.agent', 'name email');
    
    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    res.status(201).json({
      message: 'File uploaded and distributed successfully',
      list: list
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      message: 'Error processing file', 
      error: error.message 
    });
  }
};

// @desc    Get all lists
// @route   GET /api/lists
// @access  Private
const getLists = async (req, res) => {
  try {
    const lists = await List.find()
      .populate('distributions.agent', 'name email')
      .populate('uploadedBy', 'email')
      .sort({ createdAt: -1 });
    
    res.json(lists);
  } catch (error) {
    console.error('Get lists error:', error);
    res.status(500).json({ message: 'Server error while fetching lists' });
  }
};

// @desc    Get list by ID
// @route   GET /api/lists/:id
// @access  Private
const getListById = async (req, res) => {
  try {
    const list = await List.findById(req.params.id)
      .populate('distributions.agent', 'name email')
      .populate('uploadedBy', 'email');
    
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }
    
    res.json(list);
  } catch (error) {
    console.error('Get list error:', error);
    res.status(500).json({ message: 'Server error while fetching list' });
  }
};

module.exports = {
  upload,
  uploadList,
  getLists,
  getListById
};