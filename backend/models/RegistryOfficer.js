import mongoose from 'mongoose';

const registryOfficerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const RegistryOfficer = mongoose.model('RegistryOfficer', registryOfficerSchema);
export default RegistryOfficer; 