import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dbConnection } from './initDatabase.js';
import pool from '../config/database.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const migrateEmailVerification = async () => {
  try {
    console.log('Starting email verification migration...');
    
    const connected = await dbConnection();
    if (!connected) {
      console.error('Cannot connect to database. Please check your .env configuration.');
      process.exit(1);
    }

    const migrationPath = path.join(__dirname, 'migrations', 'add_email_verification.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Execute migration SQL
    await pool.query(migrationSQL);

    console.log('✅ Email verification migration completed successfully');
    console.log('Added columns: email_verified, email_verification_token, email_verification_token_expires_at, password_reset_token, password_reset_token_expires_at');
    
    process.exit(0);
  } catch (error: any) {
    console.error('Migration failed:', error.message);
    if (error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }
};

migrateEmailVerification();
