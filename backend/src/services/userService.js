import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { DEFAULT_ROLE_PERMISSIONS } from '../constants/roles.js';

const prisma = new PrismaClient();

class UserService {
  async createUser(
    email,
    password,
    name,
    role = 'STUDENT'
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user without transactions
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });
    return user;
  }

  async findUserById(id) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async getAllUsers() {
    return prisma.user.findMany({ include: { permissions: true } });
  }

  async updateUser(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id) {
    return prisma.user.delete({ where: { id } });
  }

  async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password);
  }
}

export { UserService };
