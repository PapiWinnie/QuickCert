import dotenv from 'dotenv';
dotenv.config();
import Admin from '../models/Admin.js';
import RegistryOfficer from '../models/RegistryOfficer.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET ;

// Helper to generate JWT
function generateToken(user, role) {
  return jwt.sign({ id: user._id, role }, JWT_SECRET, { expiresIn: '1d' });
}

// Admin Registration
export async function registerAdmin(req, res) {
  try {
    const { email, password } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, password: hashed });
    res.status(201).json({ message: 'Admin registered' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Admin Login
export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = generateToken(admin, 'admin');
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Officer Registration (by Admin)
export async function registerOfficer(req, res) {
  try {
    const { fullName, email, password } = req.body;
    const existing = await RegistryOfficer.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const officer = await RegistryOfficer.create({ fullName, email, password: hashed });
    res.status(201).json({ message: 'Officer registered' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Officer Login
export async function loginOfficer(req, res) {
  try {
    const { email, password } = req.body;
    const officer = await RegistryOfficer.findOne({ email });
    if (!officer) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, officer.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = generateToken(officer, 'officer');
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// List all officers (admin only)
export async function listOfficers(req, res) {
  try {
    const officers = await RegistryOfficer.find({}, '-password'); // Exclude password
    res.json(officers);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

// Delete officer by ID (admin only)
export async function deleteOfficer(req, res) {
  try {
    const { id } = req.params;
    const deleted = await RegistryOfficer.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Officer not found' });
    res.json({ message: 'Officer deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
} 