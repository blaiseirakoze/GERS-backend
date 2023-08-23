import multer from 'multer';
const path = require('path');
const os = require('os');

// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let destPath = path.join(__dirname, '../../../GERS-frontend/src/files');
    cb(null, destPath);
  },
  filename: (req, file, cb) => {    
    const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});

const multerUploads = multer({ storage }).fields([
  { name: 'documents', maxCount: 5 },
  { name: 'bidDocuments', maxCount: 5 },
  { name: 'deliveryNote', maxCount: 2 },
  { name: 'receipt', maxCount: 2 },
  { name: 'contract', maxCount: 2 },
]);

export { multerUploads };
