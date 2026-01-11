import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dbConnection } from './initDatabase.js';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const migrate = async () => {
  try {
    console.log('Starting database migration...');
    
    const connected = await dbConnection();
    if (!connected) {
      console.error('Cannot connect to database. Please check your .env configuration.');
      process.exit(1);
    }

    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || '5432';
    const dbName = process.env.DB_NAME || 'lavatec';
    const dbUser = process.env.DB_USER || 'postgres';
    const dbPassword = process.env.DB_PASSWORD || 'postgres';

    const schemaPath = path.join(__dirname, 'schema.sql');

    const command = `PGPASSWORD="${dbPassword}" psql -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -f ${schemaPath}`;

    console.log('Executing SQL file...');
    const { stdout, stderr } = await execAsync(command);

    if (stdout) {
      console.log(stdout);
    }

    if (stderr && !stderr.includes('already exists')) {
      const errorLines = stderr.split('\n').filter((line: string) => 
        line.trim() && 
        !line.includes('already exists') &&
        !line.includes('NOTICE')
      );
      
      if (errorLines.length > 0) {
        console.warn('Migration warnings:');
        errorLines.forEach((line: string) => console.warn(line));
      }
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error: any) {
    console.error('Migration failed:', error.message);
    if (error.stderr) {
      console.error('Error details:', error.stderr);
    }
    process.exit(1);
  }
};

migrate();

