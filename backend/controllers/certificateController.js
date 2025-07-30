import BirthCertificate from '../models/BirthCertificate.js';

// Create a new birth certificate record
export async function createCertificate(req, res) {
  try {
    const {
      fullName,
      dateOfBirth,
      placeOfBirth,
      gender,
      fatherName,
      motherName,
      certificateNumber,
    } = req.body;

    // The user's ID is attached by the auth middleware
    const uploadedBy = req.user.id;

    const newCertificate = await BirthCertificate.create({
      fullName,
      dateOfBirth,
      placeOfBirth,
      gender,
      fatherName,
      motherName,
      certificateNumber,
      uploadedBy,
    });

    res.status(201).json(newCertificate);
  } catch (err) {
    // Handle potential duplicate certificate number error
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Certificate number already exists.' });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Get all certificates submitted by the logged-in officer, or all if admin
export async function getMyCertificates(req, res) {
  try {
    let certificates;
    if (req.user.role === 'admin') {
      certificates = await BirthCertificate.find().populate({ path: 'uploadedBy', select: 'fullName' }).sort({ createdAt: -1 });
    } else {
      certificates = await BirthCertificate.find({ uploadedBy: req.user.id }).populate({ path: 'uploadedBy', select: 'fullName' }).sort({ createdAt: -1 });
    }
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
} 