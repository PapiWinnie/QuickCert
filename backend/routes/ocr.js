import express from 'express';
import { ocrUpload } from '../controllers/ocrController.js';
import { authenticateToken } from '../middlewares/auth.js';
import multer from 'multer';

// Multer setup: accept only images, store in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  },
});

const router = express.Router();

// Protected route for OCR upload
router.post('/upload', authenticateToken, upload.single('file'), ocrUpload);

export default router; 