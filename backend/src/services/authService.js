import jwt from 'jsonwebtoken';
import { UserService } from './userService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const userService = new UserService();

class AuthService {
  constructor() {
    this.userService = new UserService();
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      console.error('Verify token error:', error);
      console.error('token:', token);
      throw new Error('Invalid token');
    }
  }

  async authenticate(email, password) {
    const user = await this.userService.findUserByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await this.userService.verifyPassword(user, password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    return user;
  }
}

export { AuthService };
