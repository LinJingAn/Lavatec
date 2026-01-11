import pool from '../config/database.js';

export const dbConnection = async (): Promise<boolean> => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful');
    return true;
  } catch (error: any) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

