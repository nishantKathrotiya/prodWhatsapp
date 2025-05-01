const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const Student = require('../Modal/Student');
const { upsertMetadata } = require('./Metadata');
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
    const filetypes = /xlsx|xls|csv/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only Excel (.xlsx, .xls) and CSV files are allowed!' + file.mimetype));
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
        updatedRecords: 0,
        newRecords: 0,
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
    const format = req.query.format || 'xlsx';
    let templatePath, filename;

    if (format.toLowerCase() === 'csv') {
      templatePath = path.join(__dirname, '../templates/student_template.csv');
      filename = 'student_template.csv';
    } else {
      templatePath = path.join(__dirname, '../templates/student_template.xlsx');
      filename = 'student_template.xlsx';
    }

    res.download(templatePath, filename);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Helper function to process file
async function processFile(filePath, fileId) {
  try {
    const fileExt = path.extname(filePath).toLowerCase();
    let data = [];

    if (fileExt === '.csv') {
      // Process CSV file
      data = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => results.push(row))
          .on('end', () => resolve(results))
          .on('error', (error) => reject(error));
      });
    } else {
      // Process Excel file
      const workbook = xlsx.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = xlsx.utils.sheet_to_json(worksheet);
    }

    let processedCount = 0;
    let updatedCount = 0;
    let newCount = 0;
    const totalRecords = data.length;

    processingStatus[fileId].totalRecords = totalRecords;

    for (const row of data) {
      try {
        const studentData = {
          studentId: row['Roll No'],
          firstName: row['First Name'] || '',
          lastName: row['Last Name'] || '',
          fatherName: row['Father Name'] || '',
          currentSemester: parseInt(row['Current Semester']) || 1,
          division: row['Division'] || 'A',
          batch: row['Batch'] || '1',
          counsellor: parseInt(row['Counsellor']) || 1,
          department: row['Department'] || 'IT',
          personalNumber: extractFirstNumber(row['Mobile No']) || null,
          homeNumber: extractFirstNumber(row['Home Phone No']) || null,
          year: parseInt(row['Year']) || 1
        };

        // Check if student exists
        const existingStudent = await Student.findOne({ studentId: studentData.studentId });

        if (existingStudent) {
          // Update existing student
          await Student.updateOne({ studentId: studentData.studentId }, studentData);
          updatedCount++;
        } else {
          // Create new student
          const student = new Student(studentData);
          await student.save();
          newCount++;
        }

        processedCount++;
        processingStatus[fileId].processedRecords = processedCount;
        processingStatus[fileId].updatedRecords = updatedCount;
        processingStatus[fileId].newRecords = newCount;
      } catch (error) {
        console.error(`Error processing record: ${error.message}`);
      }
    }

    // Update metadata after processing all records
    try {
      await upsertMetadata();
    } catch (error) {
      console.error('Error updating metadata:', error);
    }

    // Delete the uploaded file after successful processing
    try {
      fs.unlinkSync(filePath);
      console.log(`Successfully deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }

    processingStatus[fileId].status = 'completed';
    processingStatus[fileId].totalRecords = processedCount;
  } catch (error) {
    processingStatus[fileId].status = 'failed';
    processingStatus[fileId].error = error.message;
    
    // Try to delete the file even if processing failed
    try {
      fs.unlinkSync(filePath);
      console.log(`Deleted file after processing failure: ${filePath}`);
    } catch (deleteError) {
      console.error(`Error deleting file after processing failure ${filePath}:`, deleteError);
    }
  }
}

function extractFirstNumber(phoneString) {
  if (
    !phoneString ||
    phoneString.toLowerCase() === "no" ||
    phoneString.toLowerCase() === "nan" ||
    phoneString.toLowerCase() === "-" ||
    phoneString.toLowerCase() === "n/a" ||
    phoneString.toLowerCase() === "null"
  ) {
    return null;
  }
  const numbers = phoneString.split(/,|\s+/).filter((num) => num.trim() !== "");
  return numbers.length > 0 ? numbers[0] : null;
}

module.exports = {
  uploadStudents,
  getProcessingStatus,
  downloadTemplate
}; 