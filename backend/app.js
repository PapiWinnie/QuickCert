import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import ocrRoutes from './routes/ocr.js';
import certificateRoutes from './routes/certificates.js';

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Reconstruct credentials file on platforms like Render
const credentialsPath = path.join(__dirname, 'gcloud-vision-key.json');

if (process.env.GOOGLE_CREDENTIALS_JSON && !existsSync(credentialsPath)) {
  writeFileSync(credentialsPath, process.env.GOOGLE_CREDENTIALS_JSON, 'utf8');
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
}

// Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/certificates', certificateRoutes);

// Health check route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'API is working' });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 