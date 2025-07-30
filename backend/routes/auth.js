import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  registerOfficer,
  loginOfficer,
  listOfficers,
  deleteOfficer
} from '../controllers/authController.js';

const router = express.Router();

// Admin routes
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);

// Officer routes
router.post('/officer/register', registerOfficer); // Should be protected in real use
router.post('/officer/login', loginOfficer);
// Admin: list and delete officers
router.get('/officer', listOfficers); // List all officers
router.delete('/officer/:id', deleteOfficer); // Delete officer by ID

export default router; 