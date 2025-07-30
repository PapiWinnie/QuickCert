import vision from '@google-cloud/vision';
import dotenv from 'dotenv';
dotenv.config();

// Google Vision client (credentials from env)
const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Helper: parse fields from raw text
function parseFields(text) {
  // Simple regex/keyword-based extraction (customize as needed)
  const getField = (label, pattern) => {
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
  };
  return {
    fullName: getField('Full Name', /Full Name[:\s]*([A-Za-z\s]+)/i),
    dateOfBirth: getField('Date of Birth', /Date of Birth[:\s]*([\d\/-]+)/i),
    placeOfBirth: getField('Place of Birth', /Place of Birth[:\s]*([A-Za-z\s]+)/i),
    gender: getField('Gender', /Gender[:\s]*([A-Za-z]+)/i),
    fatherName: getField("Father's Name", /Father'?s Name[:\s]*([A-Za-z\s]+)/i),
    motherName: getField("Mother's Name", /Mother'?s Name[:\s]*([A-Za-z\s]+)/i),
    certificateNumber: getField('Certificate No', /Certificate (?:No|Number)[:\s]*([A-Za-z0-9\-]+)/i),
  };
}

export async function ocrUpload(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // OCR with Google Vision
    const [result] = await client.textDetection({ image: { content: req.file.buffer } });
    const rawText = result.fullTextAnnotation ? result.fullTextAnnotation.text : '';
    if (!rawText) return res.status(400).json({ message: 'No text found in image' });
    // Parse fields
    const fields = parseFields(rawText);
    res.json({ rawText, ...fields });
  } catch (err) {
    res.status(500).json({ message: 'OCR error', error: err.message });
  }
} 