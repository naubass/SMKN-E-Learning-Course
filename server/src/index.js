import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import prisma from './utils/prisma.js';
import auth from './routes/auth.js';
import course from './routes/course.js';
import chapter from './routes/chapter.js';
import uploadRoutes from './routes/upload.js';
import lessonRoutes from './routes/lesson.js';
import progressRoutes from './routes/progress.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// TODO: middlewares lain akan didaftarkan di sini
app.use('/api/auth', auth);
app.use('/api/courses', course); 
app.use('/api', chapter);
app.use('/api/upload', uploadRoutes);
app.use('/api', lessonRoutes);
app.use('/api', progressRoutes);

// Serve folder uploads supaya gambar bisa diakses lewat URL
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'SMK Learning Platform API is running' });
});

// Test koneksi database
app.get('/api/health/db', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});