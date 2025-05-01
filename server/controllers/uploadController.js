const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const Student = require('../Modal/Student.js');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueId = uuidv4();
    cb(null, `${uniqueId}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /xlsx|xls/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only Excel files are allowed!'));
  }
}).single('file');

// Store processing status in memory (in production, use Redis or database)
const processingStatus = {};

const uploadStudents = async (req, res) => {
  try {
    upload(req, res, async function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileId = path.parse(req.file.filename).name;
      processingStatus[fileId] = {
        status: 'processing',
        totalRecords: 0,
        processedRecords: 0,
        error: null
      };

      // Start processing in background
      processFile(req.file.path, fileId);

      res.json({
        success: true,
        message: 'File uploaded successfully',
        fileId: fileId
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProcessingStatus = async (req, res) => {
  try {
    const { fileId } = req.params;
    const status = processingStatus[fileId];

    if (!status) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadTemplate = (req, res) => {
  try {
    const templatePath = path.join(__dirname, '../templates/student_template.xlsx');
    res.download(templatePath, 'student_template.xlsx');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to process Excel file
async function processFile(filePath, fileId) {
  try {
    const workbook = xlsx.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(worksheet);

    let processedCount = 0;
    const totalRecords = data.length;

    processingStatus[fileId].totalRecords = totalRecords;

    for (const row of data) {
      try {
        const student = new Student({
          name: row.name,
          email: row.email,
          phone: row.phone,
          department: row.department,
          year: row.year,
          division: row.division,
          batch: row.batch
        });

        await student.save();
        processedCount++;
        processingStatus[fileId].processedRecords = processedCount;
      } catch (error) {
        console.error(`Error processing record: ${error.message}`);
      }
    }

    processingStatus[fileId].status = 'completed';
    processingStatus[fileId].totalRecords = processedCount;
  } catch (error) {
    processingStatus[fileId].status = 'failed';
    processingStatus[fileId].error = error.message;
  }
}

module.exports = {
  uploadStudents,
  getProcessingStatus,
  downloadTemplate
}; 