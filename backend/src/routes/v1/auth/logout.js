import { Router } from 'express';
import { authenticate } from '../../../middlewares/authMiddleware.js';

const logout_router = Router();

// Note: Since JWT is stateless, a proper logout requires client-side token removal
// Server-side we can implement a token blacklist if needed
logout_router.post('/logout', authenticate, (req, res) => {
  // In a production app, you might add the token to a blacklist in Redis
  res.status(200).json({ message: 'Logged out successfully' });
});

export default logout_router;
