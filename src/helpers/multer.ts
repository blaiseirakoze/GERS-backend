import multer from 'multer';

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).fields([
  { name: 'supportingDocument', maxCount: 5 },
]);

export { multerUploads };
