import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET ;

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err); // log full error
    return res.status(403).json({ message: err?.message || 'Invalid token' });
  }
}

// Optional: Role-based middleware
export function requireRole(role) {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ message: "You don't have permission to view this." });
    }
    next();
  };
}

// Allow multiple roles
export function requireAnyRole(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ message: "You don't have permission to view this." });
    }
    next();
  };
} 