import { Router } from 'express';
import { UserService } from '../../../services/userService.js';
import { AuthService } from '../../../services/authService.js';
import { Role } from '../../../constants/roles.js';

const register_router = Router();
const userService = new UserService();
const authService = new AuthService();

register_router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = Role.STUDENT } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }
    
    // Check if user with this email already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const user = await userService.createUser(email, password, name, role);
    
    // Generate authentication token
    const token = authService.generateToken(user);
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default register_router;
