import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { dbConnection } from './db/initDatabase.js';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import deliveryRoutes from './routes/deliveryRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import supplyRoutes from './routes/supplyRoutes.js';
import smsRoutes from './routes/smsRoutes.js';

const app: Express = express();

// Configure CORS before other middleware
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = Array.isArray(config.cors.origin) 
      ? config.cors.origin 
      : [config.cors.origin as string];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}. Allowed origins:`, allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly for all routes
app.options('*', cors(corsOptions));

// Configure helmet with CORS-friendly settings
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/supplies', supplyRoutes);
app.use('/api/sms', smsRoutes);

app.use(errorHandler);

const PORT = config.port;

const startServer = async () => {
  try {
    console.log('Starting server');
    const connected = await dbConnection();
    
    if (!connected) {
      console.error('Database connection failed. Please check your .env configuration.');
      console.error('Make sure PostgreSQL is running and the database exists.');
      console.error('Run "npm run migrate" to set up the database schema.');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      const origins = Array.isArray(config.cors.origin) 
        ? config.cors.origin.join(', ') 
        : config.cors.origin;
      console.log(`CORS enabled for: ${origins}`);
    });
  } catch (error: any) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;

