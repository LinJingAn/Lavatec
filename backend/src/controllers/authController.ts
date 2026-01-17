import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/database.js';
import { config } from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import { emailService } from '../services/emailService.js';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name, role = 'user', branch_id } = req.body;

    if (!email || !password || !name) {
      throw new AppError('Email, password, and name are required', 400);
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await pool.query(
      'SELECT id FROM users WHERE LOWER(email) = $1',
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('User with this email already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24); // 24 hours expiry

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, name, role, branch_id, email_verification_token, email_verification_token_expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, name, role, branch_id, created_at, email_verified`,
      [normalizedEmail, passwordHash, name, role, branch_id || null, verificationToken, verificationTokenExpires]
    );

    const user = result.rows[0];

    // Send verification email
    try {
      await emailService.sendVerificationEmail(normalizedEmail, name, verificationToken);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email fails, but log it
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwt.secret as string,
      { expiresIn: config.jwt.expiresIn } as SignOptions
    );

    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        email_verified: user.email_verified,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Normalize email to lowercase for case-insensitive matching
    const normalizedEmail = email.toLowerCase().trim();

    const result = await pool.query(
      'SELECT id, email, password_hash, name, role, branch_id, is_active, email_verified FROM users WHERE LOWER(email) = $1',
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      console.log(`Login attempt failed: User not found with email: ${normalizedEmail}`);
      throw new AppError('Invalid credentials', 401);
    }

    const user = result.rows[0];

    if (!user.is_active) {
      console.log(`Login attempt failed: Account deactivated for email: ${normalizedEmail}`);
      throw new AppError('Account is deactivated', 403);
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      console.log(`Login attempt failed: Invalid password for email: ${normalizedEmail}`);
      throw new AppError('Invalid credentials', 401);
    }

    // Check if email is verified (optional - can be made required)
    // Uncomment the following lines to require email verification before login:
    // if (!user.email_verified) {
    //   throw new AppError('Please verify your email address before logging in. Check your inbox for the verification email.', 403);
    // }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwt.secret as string,
      { expiresIn: config.jwt.expiresIn } as SignOptions
    );

    res.json({
      message: user.email_verified ? 'Login successful' : 'Login successful. Please verify your email address.',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        branch_id: user.branch_id,
        email_verified: user.email_verified,
      },
      requiresVerification: !user.email_verified,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      throw new AppError('Verification token is required', 400);
    }

    const result = await pool.query(
      `SELECT id, email, name, email_verification_token_expires_at, email_verified
       FROM users 
       WHERE email_verification_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    const user = result.rows[0];

    // Check if already verified
    if (user.email_verified) {
      res.json({
        message: 'Email is already verified',
        verified: true,
      });
      return;
    }

    // Check if token has expired
    if (new Date() > new Date(user.email_verification_token_expires_at)) {
      throw new AppError('Verification token has expired. Please request a new one.', 400);
    }

    // Verify the email
    await pool.query(
      `UPDATE users 
       SET email_verified = true, 
           email_verification_token = NULL,
           email_verification_token_expires_at = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [user.id]
    );

    res.json({
      message: 'Email verified successfully',
      verified: true,
    });
  } catch (error) {
    next(error);
  }
};

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError('Email is required', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const result = await pool.query(
      `SELECT id, email, name, email_verified, email_verification_token_expires_at
       FROM users 
       WHERE LOWER(email) = $1`,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      // Don't reveal if user exists or not for security
      res.json({
        message: 'If an account exists with this email, a verification email has been sent.',
      });
      return;
    }

    const user = result.rows[0];

    // If already verified, don't send another email
    if (user.email_verified) {
      res.json({
        message: 'Email is already verified',
        verified: true,
      });
      return;
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

    // Update user with new token
    await pool.query(
      `UPDATE users 
       SET email_verification_token = $1,
           email_verification_token_expires_at = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3`,
      [verificationToken, verificationTokenExpires, user.id]
    );

    // Send verification email
    try {
      await emailService.sendVerificationEmail(normalizedEmail, user.name, verificationToken);
      res.json({
        message: 'Verification email sent successfully. Please check your inbox.',
      });
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      throw new AppError('Failed to send verification email. Please try again later.', 500);
    }
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const result = await pool.query(
      `SELECT id, email, name, role, branch_id, is_active, email_verified, created_at, updated_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

