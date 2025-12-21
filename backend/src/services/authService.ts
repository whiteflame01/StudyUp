import { User } from '@prisma/client';
import prisma from '../config/database';
import { 
  hashPassword, 
  comparePassword, 
  generateJWT, 
  registrationSchema, 
  loginSchema, 
  generateUsername
} from '../utils/auth';

export interface RegisterInput {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    // Validate input
    const validatedInput = registrationSchema.parse(input);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedInput.email.toLowerCase() },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    let username = generateUsername();

    while (await prisma.user.findUnique({ where: { username } })) {
      username = generateUsername();
    }

    const passwordHash = await hashPassword(validatedInput.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedInput.email.toLowerCase(),
        password: passwordHash,
        username,
      },
    });

    // Return user without password hash
    const { password: _, ...userWithoutPassword } = user;

    const token = generateJWT({
      userWithoutPassword
    });

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Login user with email and password
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    // Validate input
    const validatedInput = loginSchema.parse(input);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedInput.email.toLowerCase() },
    });

    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await comparePassword(validatedInput.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = generateJWT({
      userWithoutPassword: {
        id: user.id,
        email: user.email,
        username: user.username,
        isSetup: user.isSetup,
        createdAt: user.createdAt,
      }
    });

    // Return user without password hash
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<Omit<User, 'password'> | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Validate user exists and return user data
   */
  async validateUser(userId: string): Promise<Omit<User, 'password'>> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}