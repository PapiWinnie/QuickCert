import mongoose from 'mongoose';

const birthCertificateSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  placeOfBirth: { type: String, required: true },
  gender: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  certificateNumber: { type: String, required: true, unique: true },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RegistryOfficer',
    required: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const BirthCertificate = mongoose.model('BirthCertificate', birthCertificateSchema);
export default BirthCertificate; 