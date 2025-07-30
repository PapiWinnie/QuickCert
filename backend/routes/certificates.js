import express from 'express';
import { createCertificate, getMyCertificates } from '../controllers/certificateController.js';
import { authenticateToken, requireAnyRole, requireRole } from '../middlewares/auth.js';

const router = express.Router();

// All routes here are for officers and are protected
router.use(authenticateToken);
router.use(requireAnyRole(['officer', 'admin']));

// POST /api/certificates - Create a new certificate record (officer only)
router.post('/', requireRole('officer'), createCertificate);

// GET /api/certificates - Get all records submitted by the officer or all if admin
router.get('/', getMyCertificates);

export default router; 