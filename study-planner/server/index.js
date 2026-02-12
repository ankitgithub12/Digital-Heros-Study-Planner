import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import planRoutes from './routes/planRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/plans', planRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'StudyFlow AI Server is running' });
});

// For future AI proxying if needed to hide HF token
app.get('/api/config', (req, res) => {
  res.json({
    aiEnabled: !!process.env.VITE_HF_API_TOKEN,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
