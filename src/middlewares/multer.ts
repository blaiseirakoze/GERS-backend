import multer from 'multer';
const path = require('path');
const os = require('os');

// const storage = multer.memoryStorage();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {    
    let dest = '/Documents/projects/my-projects/approval-system/files/project-files';
    cb(null, path.join(os.homedir(), dest));
  },
  filename: (req, file, cb) => {
    const fileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  }
});
const multerUploads = multer({ storage }).fields([
  { name: 'documents', maxCount: 5 },
]);

export { multerUploads };
