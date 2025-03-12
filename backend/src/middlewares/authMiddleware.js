import { AuthService } from '../services/authService.js';
import { UserService } from '../services/userService.js';

const authService = new AuthService();
const userService = new UserService();

/**
 * Middleware to authenticate requests using JWT
 */
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.token;
    
    const decoded = await authService.verifyToken(token);
    console.info('Decoded token:', decoded);
    
    const user = await userService.findUserById(decoded.id);
    console.info('Authenticated user:', user);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Middleware to check if user has required role
 */
const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (Array.isArray(roles) && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    if (typeof roles === 'string' && roles !== req.user.role) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};

/**
 * Middleware to check if user has required permission
 */
const hasPermission = (action, subject) => {
  return (req, res, next) => {
    if (!req.user || !req.user.permissions) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const hasRequiredPermission = req.user.permissions.some(
      permission => permission.action === action && permission.subject === subject
    );
    
    if (!hasRequiredPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};

export {
  authenticate,
  hasRole,
  hasPermission
};
