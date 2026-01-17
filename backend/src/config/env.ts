import dotenv from 'dotenv';

dotenv.config();

// Parse CORS origin - handle single origin or comma-separated list
const parseCorsOrigin = (): string | string[] => {
  const origin = process.env.CORS_ORIGIN || 'http://localhost:5173';
  
  // If it contains a comma, split into array
  if (typeof origin === 'string' && origin.includes(',')) {
    const origins = origin.split(',').map(o => o.trim()).filter(o => o.length > 0);
    
    // In development, ensure http://localhost:5173 is included
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (nodeEnv === 'development' && !origins.includes('http://localhost:5173')) {
      origins.push('http://localhost:5173');
    }
    
    return origins;
  }
  
  return origin;
};

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: (process.env.JWT_SECRET || 'secret') as string,
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string,
  },
  cors: {
    origin: parseCorsOrigin(),
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@lavatec.com',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  sms: {
    provider: process.env.SMS_PROVIDER || 'mock', // 'mock', 'twilio', 'aws'
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    },
    aws: {
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  },
};

