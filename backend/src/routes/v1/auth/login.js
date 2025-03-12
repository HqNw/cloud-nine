import { Router } from 'express';
import { UserService } from '../../../services/userService.js';
import { AuthService } from '../../../services/authService.js';

const login_router = Router();
const userService = new UserService();
const authService = new AuthService();

login_router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userService.findUserByEmail(email);
    if (!user || !await userService.verifyPassword(user, password)) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    const token = authService.generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      // Token expires in 2 days
      expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    });
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default login_router;

