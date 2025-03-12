import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import lessonsRouter from './routes/v1/lessons/index.js';
import authRouter from './routes/v1/auth/index.js';



const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
// Allow client connection from any origin in development, or use environment variable in production
const CORS_ORIGIN = process.env.NODE_ENV === 'production' 
  ? process.env.CORS_ORIGIN || 'http://localhost:3000'
  : '*';

// Middleware
app.use(express.json());
app.use(cors(
  {
    origin: CORS_ORIGIN,
    credentials: true
  }
));
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(morgan('dev'));

// Register routes - lessons router added at the top
app.use('/v1/lessons', lessonsRouter);
app.use('/v1/auth', authRouter);


app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    req.url = req.url.substring(4);
  }
  next();
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Check if this file is being run directly
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on 0.0.0.0:${PORT} in ${NODE_ENV} mode`);
  console.log(`CORS allowing origin: ${CORS_ORIGIN}`);
});

  export default app;

