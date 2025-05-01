const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {directMessageSend} = require('./socket.js');

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
    cb(new Error('Only Excel (.xlsx, .xls) and CSV files are allowed!'));
  }
}).single('file');

// Store processing status in memory (in production, use Redis or database)
const processingStatus = {};

const downloadTemplate = async (req, res) => {
  try{
 
  let templatePath, filename;
  const tempDir = path.join(__dirname, '../templates');
  
  // Create templates directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
 
    templatePath = path.join(__dirname, '../templates/contacts_template.csv');
    filename = 'contacts_template.csv';
  

  res.download(templatePath, filename);
  
  } catch (error) {
    console.error('Error generating template:', error);
    res.status(500).json({ error: 'Error generating template' });
  }
};

const uploadContacts = async (req, res) => {
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
        totalContacts: 0,
        contacts: [],
        error: null
      };

      // Start processing in background
      processFile(req.file.path, fileId)
        .then(() => {
          res.json({
            success: true,
            message: 'File uploaded successfully',
            fileId: fileId,
            totalContacts: processingStatus[fileId].totalContacts
          });
        })
        .catch(error => {
          res.status(500).json({ error: error.message });
        });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const processFile = async (filePath, fileId) => {
  try {
    const fileExt = path.extname(filePath).toLowerCase();
    let contacts = [];

    if (fileExt === '.csv') {
      // Process CSV file
      contacts = await new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (row) => {
            // Check for both 'contactno' and 'contact' column names
            const contactNumber = row.contactno || row.contact;
            if (contactNumber) {
              // Remove any non-numeric characters and ensure it's a valid number
              const cleanNumber = contactNumber.toString().replace(/\D/g, '');
              if (cleanNumber.length >= 10) { // Basic validation for phone numbers
                results.push(cleanNumber);
              }
            }
          })
          .on('end', () => {
            console.log(`Processed ${results.length} contacts from CSV`);
            resolve(results);
          })
          .on('error', (error) => {
            console.error('Error processing CSV:', error);
            reject(error);
          });
      });
    } else {
      // Process Excel file
      const workbook = xlsx.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet);
      contacts = data
        .map(row => {
          const contactNumber = row.contactno || row.contact;
          if (contactNumber) {
            const cleanNumber = contactNumber.toString().replace(/\D/g, '');
            return cleanNumber.length >= 10 ? cleanNumber : null;
          }
          return null;
        })
        .filter(Boolean);
      console.log(`Processed ${contacts.length} contacts from Excel`);
    }

    // Store contacts in processing status
    processingStatus[fileId].contacts = contacts;
    processingStatus[fileId].totalContacts = contacts.length;
    processingStatus[fileId].status = 'completed';

    // Delete the file after processing
    try {
      fs.unlinkSync(filePath);
      console.log(`Successfully deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  } catch (error) {
    console.error('Error in processFile:', error);
    processingStatus[fileId].status = 'failed';
    processingStatus[fileId].error = error.message;
    throw error;
  }
};

const sendMessages = async (req, res) => {
  directMessageSend(req,res,processingStatus);
};

module.exports = {
  uploadContacts,
  sendMessages,
  downloadTemplate
}; 